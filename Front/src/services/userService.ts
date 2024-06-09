import { UserDTO, UserInputDTO } from '@/dtos/User'
import { CreatedDTO } from '@/dtos/defaults'
import { api } from '@/http/api'
import { handleError } from './errors/errorHandler'
import { userRolesService } from './userRolesService'
import { authService } from './authService'

async function getAll() {
  try {
    const { data } = await api.get<UserDTO[]>('/users/all')
    return data
  } catch (error) {
    handleError(error, 'listar', 'usuários')
  }
}

async function getById(id: number) {
  try {
    const { data } = await api.get<UserDTO>(`/users/${id}`)
    return data
  } catch (error) {
    handleError(error, 'encontrar', 'usuário')
  }
}

async function create(user: UserInputDTO) {
  try {
    const { data } = await api.post<CreatedDTO>('/users', user)
    return data
  } catch (error) {
    handleError(error, 'cadastrar', 'usuário')
  }
}

async function update(id: number, updatedUser: Partial<UserInputDTO>) {
  try {
    await api.put(`/users/${id}`, updatedUser)
  } catch (error) {
    handleError(error, 'modificar', 'usuário')
  }
}

async function deleteById(id: number) {
  try {
    await api.delete(`/users/${id}`)
  } catch (error) {
    handleError(error, 'remover', 'usuário')
  }
}

async function getByAuth() {
  try {
    const auth = authService.getUserAuth()
    if (auth) {
      const userByCompany = await userRolesService.getByCompanyId(
        auth.companyId,
      )
      const data = userByCompany?.filter(
        (item) => item.id.typeUser === auth.typeUser,
      )
      if (data) {
        const users: UserDTO[] = []
        for (const item of data) {
          const user = await getById(item.id.userId)
          if (user) {
            users.push(user)
          }
        }
        return users
      }
    }
  } catch (error) {
    handleError(error, 'listar', 'usuários')
  }
}

export const userService = {
  create,
  getById,
  update,
  deleteById,
  getAll,
  getByAuth,
}
