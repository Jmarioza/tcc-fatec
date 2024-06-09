import { api } from '@/http/api'
import { handleError } from './errors/errorHandler'
import {
  UserAccreditorBeneficiaryGroupInputDTO,
  UserAccreditorBeneficiaryGroupOutputDTO,
} from '@/dtos/UserAccreditorBeneficiaryGroup'

async function getAll() {
  try {
    const { data } = await api.get<UserAccreditorBeneficiaryGroupOutputDTO[]>(
      '/users_accreditors_benefgroups/all',
    )
    return data
  } catch (error) {
    handleError(error, 'listar', 'grupos de beneficiários do usuário')
  }
}

interface GetProps {
  beneficiaryGroupId: number
  accreditorId: number
  userId: number
}

async function get(filters: Partial<GetProps>) {
  try {
    const { data } = await api.get<UserAccreditorBeneficiaryGroupOutputDTO[]>(
      '/users_accreditors_benefgroups/filters',
      {
        params: {
          ...filters,
        },
      },
    )
    return data
  } catch (error) {
    handleError(error, 'listar', 'grupos de beneficiários do usuário')
  }
}
async function deleteById(filters: GetProps) {
  try {
    const { data } = await api.delete('/users_accreditors_benefgroups', {
      params: {
        ...filters,
      },
    })
    return data
  } catch (error) {
    handleError(error, 'listar', 'grupos de beneficiários do usuário')
  }
}
async function create(body: UserAccreditorBeneficiaryGroupInputDTO) {
  try {
    const { data } = await api.post('/users_accreditors_benefgroups', body)
    return data
  } catch (error) {
    handleError(error, 'listar', 'grupos de beneficiários do usuário')
  }
}

export const userAccreditorBeneficiaryGroupService = {
  deleteById,
  create,
  getAll,
  get,
}
