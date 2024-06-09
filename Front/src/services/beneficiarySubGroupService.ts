import {
  BeneficiarySubGroupDTO,
  BeneficiarySubGroupInputDTO,
} from '@/dtos/BeneficiarySubGroup'
import { CreatedDTO } from '@/dtos/defaults'
import { api } from '@/http/api'
import { handleError } from './errors/errorHandler'
import { BeneficiaryGroupDTO } from '@/dtos/BeneficiaryGroup'
import { beneficiaryGroupService } from './beneficiaryGroupService'
import { fetchAllPages } from './utils/fetchAllPaged'

export interface BeneficiaryGroups extends BeneficiarySubGroupDTO {
  group: BeneficiaryGroupDTO | undefined
}

async function getAll() {
  try {
    const { data } = await api.get<BeneficiarySubGroupDTO[]>(
      '/beneficiary_subgroups/all',
    )
    return data
  } catch (error) {
    handleError(error, 'listar', 'subgrupos de beneficiarios')
  }
}

async function getById(id: number) {
  try {
    const { data } = await api.get<BeneficiarySubGroupDTO>(
      `/beneficiary_subgroups/${id}`,
    )
    return data
  } catch (error) {
    handleError(error, 'encontrar', 'subgrupo de beneficiario')
  }
}

async function create(group: BeneficiarySubGroupInputDTO) {
  try {
    const { data } = await api.post<CreatedDTO>('/beneficiary_subgroups', group)
    return data
  } catch (error) {
    handleError(error, 'cadastrar', 'subgrupo de beneficiario')
  }
}

async function update(id: number, group: Partial<BeneficiarySubGroupInputDTO>) {
  try {
    await api.put(`/beneficiary_subgroups/${id}`, group)
  } catch (error) {
    handleError(error, 'modificar', 'subgrupo de beneficiario')
  }
}

async function deleteById(id: number) {
  try {
    await api.delete(`/beneficiary_subgroups/${id}`)
  } catch (error) {
    handleError(error, 'remover', 'subgrupo de beneficiario')
  }
}

async function getAllWithRelations() {
  return Promise.all([
    beneficiarySubGroupService.getAll(),
    beneficiaryGroupService.getAll(),
  ])
    .then((values) => {
      const [subGroupData, groupData] = values
      if (subGroupData && groupData) {
        return subGroupData.map((subGroup) => {
          const group = groupData.find(
            (group) => group.id === subGroup.beneficiaryGroupId,
          )
          return {
            ...subGroup,
            group,
          }
        })
      }
    })
    .catch((error) => {
      handleError(error, 'listar', 'Subgrupos')
    })
}

async function getByGroupId(groupId: number) {
  try {
    const groups = await fetchAllPages<BeneficiarySubGroupDTO>(
      api,
      `/beneficiary_subgroups/groups`,
      {
        beneficiaryGroupId: groupId,
      },
    )
    return groups
  } catch (error) {
    handleError(error, 'encontrar', 'sub grupo')
  }
}

async function getByAccreditorId(accreditorId: number) {
  try {
    const groups = await fetchAllPages<BeneficiarySubGroupDTO>(
      api,
      `/beneficiary_subgroups/accreditors`,
      {
        accreditorId,
      },
    )

    return groups
  } catch (error) {
    handleError(error, 'encontrar', 'credenciados')
  }
}

export const beneficiarySubGroupService = {
  getByAccreditorId,
  getByGroupId,
  getAllWithRelations,
  create,
  getById,
  update,
  deleteById,
  getAll,
}
