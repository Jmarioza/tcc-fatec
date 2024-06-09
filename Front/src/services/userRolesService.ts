import { UserRolesDTO, UserRolesInputDTO } from '@/dtos/UserRoles'
import { handleError } from './errors/errorHandler'
import { api } from '@/http/api'
import { CreatedDTO } from '@/dtos/defaults'
import { CompanyDTO } from '@/dtos/Company'
import { companyService } from './companyService'
import { fetchAllPages } from './utils/fetchAllPaged'

export interface UserRoles extends UserRolesDTO {
  company?: CompanyDTO
}

async function create(userRoles: UserRolesInputDTO) {
  try {
    const { data } = await api.post<CreatedDTO>('/user_roles', userRoles)
    return data
  } catch (error) {
    handleError(error, 'adicionar', 'permissão ao usuário.')
  }
}

async function getByUserId(userId: number) {
  try {
    const data = await fetchAllPages<UserRolesDTO>(api, '/user_roles/filters', {
      userId,
    })
    const userRoles: UserRoles[] = []
    for (const item of data) {
      const company = await companyService.getById(item.id.companyId)
      userRoles.push({
        ...item,
        company,
      })
    }
    return userRoles
  } catch (error) {
    handleError(error, 'encontrar', 'permissões do usuário')
  }
}

interface Id {
  userId: number
  companyId: number
  typeUser: string
}

async function deleteById(id: Id) {
  try {
    await api.delete('/user_roles', {
      params: {
        userId: id.userId,
        companyId: id.companyId,
        typeUser: id.typeUser,
      },
    })
  } catch (error) {
    handleError(error, 'remover', 'permissão de usuário')
  }
}

async function getByCompanyId(companyId: number) {
  try {
    const data = await fetchAllPages<UserRolesDTO>(api, '/user_roles/filters', {
      companyId,
    })

    return data
  } catch (error) {
    handleError(error, 'listar', 'permissões de usuários')
  }
}

async function getAll() {
  try {
    const { data } = await api.get<UserRolesDTO[]>('/user_roles/all')
    return data
  } catch (error) {
    handleError(error, 'listar', 'permissões do usuário')
  }
}

export const userRolesService = {
  create,
  getByUserId,
  getAll,
  getByCompanyId,
  deleteById,
}
