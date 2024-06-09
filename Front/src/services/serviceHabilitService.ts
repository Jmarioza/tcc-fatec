import {
  ServiceHabilitDTO,
  ServiceHabilitInputDTO,
} from '@/dtos/ServiceHabilit'
import { api } from '@/http/api'
import { handleError } from './errors/errorHandler'
import { AccreditedHabilites } from '@/dtos/AccreditedHabilites'

async function getAll() {
  try {
    const { data } = await api.get<ServiceHabilitDTO[]>(
      '/services_habilits/all',
    )
    return data
  } catch (error) {
    handleError(error, 'listar', 'serviços habilitados')
  }
}

interface Id {
  accreditedId: number
  contractId: number
}
async function getById({ accreditedId, contractId }: Id) {
  try {
    const { data } = await api.get<ServiceHabilitDTO>('/services_habilits', {
      params: {
        accreditedId,
        contractId,
      },
    })
    return data
  } catch (error) {
    handleError(error, 'encontrar', 'serviços habilitados')
  }
}

async function createOrUpdate(service: ServiceHabilitInputDTO) {
  try {
    const { accreditedId, contractId } = service.id
    try {
      await getById({
        accreditedId,
        contractId,
      })
      await api.put(
        '/services_habilits',
        {
          status: service.status,
        },
        {
          params: {
            accreditedId,
            contractId,
          },
        },
      )
    } catch (error) {
      await api.post('/services_habilits', service)
    }
  } catch (error) {
    handleError(error, 'modificar', 'serviço habilitado')
  }
}

async function deleteById(id: number) {
  try {
    await api.delete(`/services_habilits/${id}`)
  } catch (error) {
    handleError(error, 'remover', 'serviço habilitado')
  }
}

async function getByAccreditedId(accreditedId: number) {
  try {
    const { data } = await api.get<AccreditedHabilites[]>(
      `services_habilits/accredited/${accreditedId}/status`,
    )
    return data
  } catch (error) {
    handleError(error, 'listar', 'serviços habilitados')
  }
}

export const serviceHabilitService = {
  createOrUpdate,
  getById,
  deleteById,
  getAll,
  getByAccreditedId,
}
