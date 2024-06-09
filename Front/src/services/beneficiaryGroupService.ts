import {
  BeneficiaryGroupDTO,
  BeneficiaryGroupInputDTO,
} from '@/dtos/BeneficiaryGroup'
import { CreatedDTO } from '@/dtos/defaults'
import { api } from '@/http/api'
import { handleError } from './errors/errorHandler'
import { fetchAllPages } from './utils/fetchAllPaged'
import { authService } from './authService'
import { userAccreditorBeneficiaryGroupService } from './userAccreditorBeneficiaryGroupService'

async function getAll() {
  try {
    const { data } = await api.get<BeneficiaryGroupDTO[]>(
      '/beneficiary_groups/all',
    )
    return data
  } catch (error) {
    handleError(error, 'listar', 'grupos de beneficiarios')
  }
}

async function getById(id: number) {
  try {
    const { data } = await api.get<BeneficiaryGroupDTO>(
      `/beneficiary_groups/${id}`,
    )
    return data
  } catch (error) {
    handleError(error, 'encontrar', 'grupos de beneficiarios')
  }
}

async function create(group: BeneficiaryGroupInputDTO) {
  try {
    const { data } = await api.post<CreatedDTO>('/beneficiary_groups', group)
    return data
  } catch (error) {
    handleError(error, 'cadastrar', 'grupos de beneficiarios')
  }
}

async function update(id: number, group: Partial<BeneficiaryGroupInputDTO>) {
  try {
    await api.put(`/beneficiary_groups/${id}`, group)
  } catch (error) {
    handleError(error, 'modificar', 'grupos de beneficiarios')
  }
}

async function deleteById(id: number) {
  try {
    await api.delete(`/beneficiary_groups/${id}`)
  } catch (error) {
    handleError(error, 'remover', 'grupos de beneficiarios')
  }
}

async function getByAccreditorId(accreditorId: number) {
  try {
    const groups = await fetchAllPages<BeneficiaryGroupDTO>(
      api,
      `/beneficiary_groups/accreditors`,
      {
        accreditorId,
      },
    )
    return groups
  } catch (error) {
    handleError(error, 'encontrar', 'credenciadora')
  }
}

interface GetByUserProps {
  accreditorId: number
}
async function getByUser({ accreditorId }: GetByUserProps) {
  try {
    const { userId } = authService.getUserAuth()
    const [allGroups, userGroups] = await Promise.all([
      getByAccreditorId(accreditorId),
      userAccreditorBeneficiaryGroupService.get({
        accreditorId,
        userId,
      }),
    ])
    if (allGroups && userGroups && userGroups.length > 0) {
      return allGroups.filter((group) =>
        userGroups.find((item) => group.id === item.beneficiaryGroupId),
      )
    }
    return allGroups
  } catch (error) {
    handleError(error, 'listar', 'grupo de beneficiários')
  }
}

export const beneficiaryGroupService = {
  getByAccreditorId,
  create,
  getById,
  update,
  deleteById,
  getAll,
  getByUser,
}
