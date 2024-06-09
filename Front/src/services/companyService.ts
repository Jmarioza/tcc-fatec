import { CompanyDTO, CompanyInputDTO } from '@/dtos/Company'
import { CreatedDTO } from '@/dtos/defaults'
import { api } from '@/http/api'
import { handleError } from './errors/errorHandler'
import { authService } from './authService'
import { removeNullFields } from '@/func/removeNullFields'

async function getAll() {
  try {
    const { data } = await api.get<CompanyDTO[]>('/companies/all')
    return data
  } catch (error) {
    handleError(error, 'listar', 'empresas')
  }
}

async function getById(id: number) {
  try {
    const { data } = await api.get<CompanyDTO>(`/companies/${id}`)
    return removeNullFields(data) as CompanyDTO
  } catch (error) {
    handleError(error, 'encontrar', 'empresa')
  }
}

async function create(company: CompanyInputDTO) {
  try {
    const { data } = await api.post<CreatedDTO>('/companies', company)
    return data
  } catch (error) {
    handleError(error, 'cadastrar', 'empresa')
  }
}

async function update(id: number, company: Partial<CompanyInputDTO>) {
  try {
    await api.put(`/companies/${id}`, company)
  } catch (error) {
    handleError(error, 'modificar', 'empresa')
  }
}

async function deleteById(id: number) {
  try {
    await api.delete(`/companies/${id}`)
  } catch (error) {
    handleError(error, 'remover', 'empresa')
  }
}

async function getByAuth() {
  try {
    const auth = authService.getUserAuth()
    if (auth) {
      const company = await getById(auth.companyId)
      return company
    }
  } catch (error) {
    handleError(error, 'encontrar', 'empresa')
  }
}

export const companyService = {
  create,
  getById,
  update,
  deleteById,
  getAll,
  getByAuth,
}
