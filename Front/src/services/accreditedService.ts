import { AccreditedDTO, AccreditedInputDTO } from '@/dtos/Accredited'
import { CreatedDTO } from '@/dtos/defaults'
import { api } from '@/http/api'
import { handleError } from './errors/errorHandler'
import { fetchAllPages } from './utils/fetchAllPaged'
import { CompanyDTO } from '@/dtos/Company'
import { accreditorService } from './accreditorService'
import { companyService } from './companyService'
import { userRolesService } from './userRolesService'

export interface Accredited extends AccreditedDTO {
  accreditedCompany: CompanyDTO | undefined
  accreditorCompany: CompanyDTO | undefined
}

export interface AccreditedsWithAccreditor {
  reasonCompanyAccreditor: string
  nameCompanyAccreditor: string
  idCompanyAccreditor: number
  idAccredited: number
  idAccreditor: number
}

interface AccreditorAndCompany {
  companyId: number
  accreditorId: number
}

async function getAll() {
  try {
    const { data } = await api.get<AccreditedDTO[]>('/accrediteds/all')
    return data
  } catch (error) {
    handleError(error, 'listar', 'credenciados')
  }
}

async function getById(id: number) {
  try {
    const { data } = await api.get<AccreditedDTO>(`/accrediteds/${id}`)
    return data
  } catch (error) {
    handleError(error, 'encontrar', 'credenciados')
  }
}

async function create(accredited: AccreditedInputDTO) {
  try {
    const { data } = await api.post<CreatedDTO>('/accrediteds', accredited)
    return data
  } catch (error) {
    handleError(error, 'cadastrar', 'credenciados')
  }
}

async function update(id: number, accredited: Partial<AccreditedInputDTO>) {
  try {
    await api.put(`/accrediteds/${id}`, accredited)
  } catch (error) {
    handleError(error, 'modificar', 'credenciados')
  }
}

async function deleteById(id: number) {
  try {
    await api.delete(`/accrediteds/${id}`)
  } catch (error) {
    handleError(error, 'remover', 'credenciados')
  }
}

async function getByCompanyId(companyId: number) {
  try {
    const data = await fetchAllPages<AccreditedDTO>(
      api,
      '/accrediteds/companies',
      {
        companyId,
      },
    )
    return data
  } catch (error) {
    handleError(error, 'listar', 'credenciados')
  }
}

async function getByAccreditor(accreditorId: number) {
  try {
    const data = await fetchAllPages<AccreditedDTO>(
      api,
      '/accrediteds/accreditors',
      {
        accreditorId,
      },
    )
    if (data) {
      const accrediteds: Accredited[] = []
      const accreditor =
        await accreditorService.getByIdWithCompany(accreditorId)
      for (const item of data) {
        const accreditedCompany = await companyService.getById(item.companyId)
        accrediteds.push({
          ...item,
          accreditedCompany,
          accreditorCompany: accreditor?.company,
        })
      }
      return accrediteds
    }
  } catch (error) {
    handleError(error, 'listar', 'credenciados')
  }
}

async function getByIdWithRelations(accreditedId: number) {
  try {
    const accredited = await getById(accreditedId)
    if (accredited) {
      const [accreditorData, accreditedCompanyData] = await Promise.all([
        accreditorService.getById(accredited.accreditorId),
        companyService.getById(accredited.companyId),
      ])
      if (accreditorData && accreditedCompanyData) {
        const accreditorCompany = await companyService.getById(
          accreditorData.companyId,
        )
        const accreditedRes: Accredited = {
          ...accredited,
          accreditedCompany: accreditedCompanyData,
          accreditorCompany,
        }

        return accreditedRes
      }
    }
  } catch (error) {
    handleError(error, 'encontrar', 'credenciado')
  }
}

async function getByAccreditorAndCompany({
  accreditorId,
  companyId,
}: AccreditorAndCompany) {
  try {
    const allAccreditedByCompanyData = await getByCompanyId(companyId)
    if (allAccreditedByCompanyData) {
      const find = allAccreditedByCompanyData.find(
        (item) => item.accreditorId === accreditorId,
      )
      return find
    }
  } catch (error) {
    handleError(error, 'listar', 'credenciados')
  }
}

async function getByUserAndAccreditor(userId: number, accreditorId: number) {
  try {
    const userRole = await userRolesService.getByUserId(userId)
    if (!userRole) {
      throw new Error('Usuário não encontrado.')
    }
    const userRolesAccrediteds = userRole.filter(
      (role) =>
        role.id.typeUser === 'ACCREDITED' ||
        role.id.typeUser === 'MASTER_ACCREDITED',
    )
    if (userRolesAccrediteds.length === 0) {
      throw new Error('Usuário não é credenciado.')
    }
    const accrediteds: Accredited[] = []
    for (const role of userRolesAccrediteds) {
      const accreditedFiltered = await getByAccreditorAndCompany({
        accreditorId,
        companyId: role.id.companyId,
      })

      if (accreditedFiltered) {
        const accredited = await getByIdWithRelations(accreditedFiltered.id)
        if (accredited) accrediteds.push(accredited)
      }
    }
    if (accrediteds.length === 0) {
      throw new Error('Usuário não vinculado com a credenciadora.')
    }
    return accrediteds
  } catch (error) {
    handleError(error, 'listar', 'credenciados')
  }
}

export const accreditedService = {
  create,
  update,
  deleteById,
  getById,
  getAll,
  getByCompanyId,
  getByAccreditor,
  getByIdWithRelations,
  getByAccreditorAndCompany,
  getByUserAndAccreditor,
}
