import { ValueDTO, ValueInputDTO } from '@/dtos/Value'
import { CreatedDTO } from '@/dtos/defaults'
import { api } from '@/http/api'
import { handleError } from './errors/errorHandler'
import { fetchAllPages } from './utils/fetchAllPaged'

async function getAll() {
  try {
    const { data } = await api.get<ValueDTO[]>('/values/all')
    return data
  } catch (error) {
    handleError(error, 'listar', 'preços')
  }
}

async function getById(id: number) {
  try {
    const { data } = await api.get<ValueDTO>(`/values/${id}`)
    return data
  } catch (error) {
    handleError(error, 'encontrar', 'preço')
  }
}

async function create(value: ValueInputDTO) {
  try {
    const { data } = await api.post<CreatedDTO>('/values', value)
    return data
  } catch (error) {
    handleError(error, 'cadastrar', 'preço')
  }
}

async function update(id: number, value: Partial<ValueInputDTO>) {
  try {
    await api.put(`/values/${id}`, value)
  } catch (error) {
    handleError(error, 'modificar', 'preço')
  }
}

async function deleteById(id: number) {
  try {
    await api.delete(`/values/${id}`)
  } catch (error) {
    handleError(error, 'remover', 'preço')
  }
}

async function getByProductId(productId: number) {
  try {
    const values = await fetchAllPages<ValueDTO>(api, `values/products`, {
      productId,
    })
    return values
  } catch (error) {
    handleError(error, 'encontrar', 'sub grupo')
  }
}

export const valueService = {
  create,
  getById,
  update,
  deleteById,
  getAll,
  getByProductId,
}
