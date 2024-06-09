import { BeneficiaryDTO, BeneficiaryInputDTO } from '@/dtos/Beneficiary'
import { CreatedDTO } from '@/dtos/defaults'
import { api } from '@/http/api'
import { handleError } from './errors/errorHandler'
import { BeneficiaryGroupDTO } from '@/dtos/BeneficiaryGroup'
import { BeneficiarySubGroupDTO } from '@/dtos/BeneficiarySubGroup'
import { beneficiarySubGroupService } from './beneficiarySubGroupService'
import { beneficiaryGroupService } from './beneficiaryGroupService'
import { fetchAllPages } from './utils/fetchAllPaged'
import {
  ImportBeneficiariesRequestDTO,
  ImportBeneficiariesResponseDTO,
} from '@/dtos/ImportBeneficiaries'

export interface Beneficiary extends BeneficiaryDTO {
  group: BeneficiaryGroupDTO | undefined
  subGroup: BeneficiarySubGroupDTO | undefined
}

async function getAll() {
  try {
    const { data } = await api.get<BeneficiaryDTO[]>('/beneficiaries/all')
    return data
  } catch (error) {
    handleError(error, 'listar', 'beneficiarios')
  }
}

async function getById(id: number) {
  try {
    const { data } = await api.get<BeneficiaryDTO>(`/beneficiaries/${id}`)
    return data
  } catch (error) {
    handleError(error, 'encontrar', 'beneficiario')
  }
}

async function create(beneficiary: BeneficiaryInputDTO) {
  try {
    const { data } = await api.post<CreatedDTO>('/beneficiaries', beneficiary)
    return data
  } catch (error) {
    handleError(error, 'cadastrar', 'beneficiario')
  }
}

async function update(id: number, beneficiary: Partial<BeneficiaryInputDTO>) {
  try {
    await api.put(`/beneficiaries/${id}`, beneficiary)
  } catch (error) {
    handleError(error, 'modificar', 'beneficiario')
  }
}

async function deleteById(id: number) {
  try {
    await api.delete(`/beneficiaries/${id}`)
  } catch (error) {
    handleError(error, 'remover', 'beneficiario')
  }
}

async function getAllWithRelations() {
  return Promise.all([
    beneficiaryService.getAll(),
    beneficiarySubGroupService.getAll(),
    beneficiaryGroupService.getAll(),
  ])
    .then((values) => {
      const [beneficiaryData, subGroupData, groupData] = values
      if (beneficiaryData && subGroupData && groupData) {
        return beneficiaryData.map((beneficiary) => {
          const group = groupData.find(
            (group) => group.id === beneficiary.beneficiaryGroupId,
          )
          const subGroup = subGroupData.find(
            (subGroup) => subGroup.id === beneficiary.beneficiarySubgroupId,
          )
          return {
            ...beneficiary,
            group,
            subGroup,
          }
        })
      }
    })
    .catch((error) => {
      handleError(error, 'listar', 'beneficiarios')
    })
}

async function getBySubGroupId(subGroupId: number) {
  try {
    const response = await fetchAllPages(
      api,
      '/api/v1/beneficiaries/subgroups',
      {
        beneficiarySubgroupId: subGroupId,
      },
    )
    return response
  } catch (error) {
    handleError(error, 'listar', 'beneficiarios')
  }
}

async function getByAccreditorId(accreditorId: number) {
  try {
    const beneficiaries = await fetchAllPages<BeneficiaryDTO>(
      api,
      `/beneficiaries/accreditors`,
      {
        accreditorId,
      },
    )
    return beneficiaries
  } catch (error) {
    handleError(error, 'listar', 'beneficiários')
  }
}

async function importBeneficiaries(body: ImportBeneficiariesRequestDTO) {
  const { data } = await api.post<ImportBeneficiariesResponseDTO>(
    '/beneficiaries/import',
    body,
    {
      validateStatus: () => true,
    },
  )
  return data
}

export const beneficiaryService = {
  importBeneficiaries,
  create,
  getById,
  update,
  deleteById,
  getAll,
  getAllWithRelations,
  getBySubGroupId,
  getByAccreditorId,
}
