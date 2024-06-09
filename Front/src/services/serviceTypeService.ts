import { ServiceTypeDTO, ServiceTypeInputDTO } from '@/dtos/ServiceType'
import { CreatedDTO } from '@/dtos/defaults'
import { api } from '@/http/api'
import { handleError } from './errors/errorHandler'

async function getAll() {
  try {
    const { data } = await api.get<ServiceTypeDTO[]>('/services/all')
    return data
  } catch (error) {
    handleError(error, 'listar', 'serviços')
  }
}

async function getById(id: number) {
  try {
    const { data } = await api.get<ServiceTypeDTO>(`/services/${id}`)
    return data
  } catch (error) {
    handleError(error, 'encontrar', 'serviços')
  }
}

async function create(services: ServiceTypeInputDTO) {
  try {
    const { data } = await api.post<CreatedDTO>('/services', services)
    return data
  } catch (error) {
    handleError(error, 'cadastrar', 'serviço')
  }
}

async function update(id: number, service: Partial<ServiceTypeInputDTO>) {
  try {
    await api.put(`/services/${id}`, service)
  } catch (error) {
    handleError(error, 'modificar', 'serviço')
  }
}

async function deleteById(id: number) {
  try {
    await api.delete(`/services/${id}`)
  } catch (error) {
    handleError(error, 'remover', 'serviço')
  }
}

export const serviceTypeService = {
  create,
  getById,
  update,
  deleteById,
  getAll,
}
