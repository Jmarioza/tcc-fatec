import { AccreditorDTO, AccreditorInputDTO } from '@/dtos/Accreditor'
import { CreatedDTO } from '@/dtos/defaults'
import { api } from '@/http/api'
import { handleError } from './errors/errorHandler'
import { removeNullFields } from '@/func/removeNullFields'
import { CompanyDTO } from '@/dtos/Company'
import { companyService } from './companyService'
import { fetchAllPages } from './utils/fetchAllPaged'
import { authService } from './authService'
import { accreditedService } from './accreditedService'

export interface Accreditor extends AccreditorDTO {
  company: CompanyDTO | undefined
}

async function getAll() {
  try {
    const { data } = await api.get<AccreditorDTO[]>('/accreditors/all')
    return removeNullFields(data) as AccreditorDTO[]
  } catch (error) {
    handleError(error, 'listar', 'Credenciadora')
  }
}

async function getByCompanyId(companyId: number) {
  try {
    const accreditors = await fetchAllPages<AccreditorDTO>(
      api,
      '/accreditors/companies',
      {
        companyId,
      },
    )
    const [accreditor] = accreditors
    return accreditor
  } catch (error) {
    handleError(error, 'listar', 'credenciadoras')
  }
}

async function getById(id: number) {
  try {
    const { data } = await api.get<AccreditorDTO>(`/accreditors/${id}`)
    return data
  } catch (error) {
    handleError(error, 'encontrar', 'Credenciadora')
  }
}

async function create(accreditor: AccreditorInputDTO) {
  try {
    const { data } = await api.post<CreatedDTO>('/accreditors', accreditor)
    return data
  } catch (error) {
    handleError(error, 'cadastrar', 'Credenciadora')
  }
}

async function update(id: number, accreditor: Partial<AccreditorInputDTO>) {
  try {
    await api.put(`/accreditors/${id}`, accreditor)
  } catch (error) {
    handleError(error, 'modificar', 'Credenciadora')
  }
}

async function deleteById(id: number) {
  try {
    await api.delete(`/accreditors/${id}`)
  } catch (error) {
    handleError(error, 'remover', 'Credenciadora')
  }
}

async function getByIdWithCompany(
  accreditorId: number,
): Promise<Accreditor | undefined> {
  try {
    const accreditor = await getById(accreditorId)
    if (!accreditor) throw new Error('Credenciadora não encontrada')
    const company = await companyService.getById(accreditor.companyId)
    return {
      ...accreditor,
      company,
    }
  } catch (error) {
    handleError(error, 'listar', 'credenciadoras')
  }
}

async function getByAuth() {
  try {
    const { companyId, typeUser } = authService.getUserAuth()
    if (typeUser === 'ACCREDITOR' || typeUser === 'LIMITED_ACCREDITOR') {
      const accreditorData = await getByCompanyId(companyId)
      if (accreditorData) {
        const companyData = await companyService.getById(
          accreditorData.companyId,
        )
        const accreditor: Accreditor = {
          ...accreditorData,
          company: companyData,
        }

        return [accreditor]
      }
    } else if (typeUser === 'ACCREDITED' || typeUser === 'MASTER_ACCREDITED') {
      const accreditedData = await accreditedService.getByCompanyId(companyId)
      if (accreditedData) {
        const accreditors: Accreditor[] = []
        for (const item of accreditedData) {
          const accreditor = await getById(item.accreditorId)
          if (accreditor) {
            const companyData = await companyService.getById(
              accreditor.companyId,
            )
            accreditors.push({
              ...accreditor,
              company: companyData,
            })
          }
        }
        return accreditors
      }
    } else if (typeUser === 'SYSTEM') {
      const [companiesData, accreditorsData] = await Promise.all([
        companyService.getAll(),
        accreditorService.getAll(),
      ])
      if (accreditorsData && companiesData) {
        const accreditorsWithCompany: Accreditor[] = accreditorsData.map(
          (item) => {
            return {
              ...item,
              company: companiesData.find(
                (company) => company.id === item.companyId,
              ),
            }
          },
        )
        return accreditorsWithCompany
      }
    }
  } catch (error) {
    handleError(error, 'encontrar', 'credenciadora autenticada.')
  }
}

async function getByAccreditedCompany(accreditedCompanyId: number) {
  try {
    const accreditedsData =
      await accreditedService.getByCompanyId(accreditedCompanyId)
    if (accreditedsData) {
      const accreditors: Accreditor[] = []
      for (const item of accreditedsData) {
        const acctorData = await getByIdWithCompany(item.accreditorId)
        if (acctorData) {
          accreditors.push(acctorData)
        }
      }
      return accreditors
    }
  } catch (error) {
    handleError(error, 'listar', 'credenciadoras')
  }
}

export const accreditorService = {
  create,
  getById,
  update,
  deleteById,
  getAll,
  getByIdWithCompany,
  getByCompanyId,
  getByAuth,
  getByAccreditedCompany,
}
