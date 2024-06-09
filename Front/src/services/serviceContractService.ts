import {
  ServiceContractDTO,
  ServiceContractInputDTO,
} from '@/dtos/ServiceContracts'
import { CreatedDTO } from '@/dtos/defaults'
import { api } from '@/http/api'
import { handleError } from './errors/errorHandler'
import { fetchAllPages } from './utils/fetchAllPaged'
import { ServiceTypeDTO } from '@/dtos/ServiceType'

export interface ServiceContract extends ServiceContractDTO {
  serviceType: ServiceTypeDTO | undefined
}

async function getAll() {
  try {
    const { data } = await api.get<ServiceContractDTO[]>(
      '/service_contracts/all',
    )
    return data
  } catch (error) {
    handleError(error, 'listar', 'serviços do contrato')
  }
}

async function getById(id: number) {
  try {
    const { data } = await api.get<ServiceContractDTO>(
      `/service_contracts/${id}`,
    )
    return data
  } catch (error) {
    handleError(error, 'encontrar', 'serviços do contrato')
  }
}

async function create(service: ServiceContractInputDTO) {
  try {
    const { data } = await api.post<CreatedDTO>('/service_contracts', service)
    return data
  } catch (error) {
    handleError(error, 'cadastrar', 'serviços do contrato')
  }
}

async function update(id: number, service: Partial<ServiceContractInputDTO>) {
  try {
    await api.put(`/service_contracts/${id}`, service)
  } catch (error) {
    handleError(error, 'modificar', 'serviços do contrato')
  }
}

async function deleteById(id: number) {
  try {
    await api.delete(`/service_contracts/${id}`)
  } catch (error) {
    handleError(error, 'remover', 'serviços do contrato')
  }
}

async function getByAccreditorId(accreditorId: number) {
  try {
    const groups = await fetchAllPages<ServiceContractDTO>(
      api,
      `/service_contracts/accreditors`,
      {
        accreditorId,
      },
    )
    return groups
  } catch (error) {
    handleError(error, 'encontrar', 'sub grupo')
  }
}

export const serviceContractService = {
  create,
  getById,
  update,
  deleteById,
  getAll,
  getByAccreditorId,
}
