import { ProductGroupDTO, ProductGroupInputDTO } from '@/dtos/ProductGroup'
import { CreatedDTO } from '@/dtos/defaults'
import { api } from '@/http/api'
import { handleError } from './errors/errorHandler'
import { fetchAllPages } from './utils/fetchAllPaged'

async function getAll() {
  try {
    const { data } = await api.get<ProductGroupDTO[]>('/product_groups/all')
    return data
  } catch (error) {
    handleError(error, 'listar', 'grupo de produtos')
  }
}

async function getById(id: number) {
  try {
    const { data } = await api.get<ProductGroupDTO>(`/product_groups/${id}`)
    return data
  } catch (error) {
    handleError(error, 'encontrar', 'grupo de produtos')
  }
}

async function create(group: ProductGroupInputDTO) {
  try {
    const { data } = await api.post<CreatedDTO>('/product_groups', group)
    return data
  } catch (error) {
    handleError(error, 'cadastrar', 'grupo de produtos')
  }
}

async function update(id: number, service: Partial<ProductGroupInputDTO>) {
  try {
    await api.put(`/product_groups/${id}`, service)
  } catch (error) {
    handleError(error, 'modificar', 'grupo de produtos')
  }
}

async function deleteById(id: number) {
  try {
    await api.delete(`/product_groups/${id}`)
  } catch (error) {
    handleError(error, 'remover', 'grupo de produtos')
  }
}

async function getByAccreditor(accreditorId: number) {
  try {
    const groups = await fetchAllPages<ProductGroupDTO>(
      api,
      '/product_groups/accreditors',
      {
        accreditorId,
      },
    )
    return groups
  } catch (error) {
    handleError(error, 'listar', 'grupo de produtos')
  }
}

export const productGroupService = {
  create,
  getById,
  update,
  deleteById,
  getAll,
  getByAccreditor,
}
