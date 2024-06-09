import { CreatedDTO } from '@/dtos/defaults'
import { api } from '@/http/api'
import { handleError } from './errors/errorHandler'
import { productGroupService } from './productGroupService'
import { ProductDTO, ProductInputDTO } from '@/dtos/Product'
import { ProductGroupDTO } from '@/dtos/ProductGroup'
import { valueService } from './valueService'
import { ValueDTO } from '@/dtos/Value'
import { fetchAllPages } from './utils/fetchAllPaged'

export interface Product extends ProductDTO {
  values: ValueDTO[] | undefined
  group: ProductGroupDTO | undefined
}

async function getAll() {
  try {
    const { data } = await api.get<ProductDTO[]>('/products/all')
    return data
  } catch (error) {
    handleError(error, 'listar', 'produtos')
  }
}

async function getById(id: number) {
  try {
    const { data } = await api.get<ProductDTO>(`/products/${id}`)
    return data
  } catch (error) {
    handleError(error, 'encontrar', 'produto')
  }
}

async function create(product: ProductInputDTO) {
  try {
    const { data } = await api.post<CreatedDTO>('/products', product)
    return data
  } catch (error) {
    handleError(error, 'cadastrar', 'produto')
  }
}

async function update(id: number, product: Partial<ProductInputDTO>) {
  try {
    await api.put(`/products/${id}`, product)
  } catch (error) {
    handleError(error, 'modificar', 'produto')
  }
}

async function deleteById(id: number) {
  try {
    await api.delete(`/products/${id}`)
  } catch (error) {
    handleError(error, 'remover', 'produto')
  }
}

async function getAllWithRelations() {
  try {
    const [productValues, groupData] = await Promise.all([
      productService.getAll(),
      productGroupService.getAll(),
    ])
    if (productValues && groupData) {
      const productsWithRelations = await Promise.all(
        productValues.map(async (product) => {
          const group = groupData.find(
            (group) => group.id === product.productGroupId,
          )
          const values = await valueService.getByProductId(product.id)
          return {
            ...product,
            group,
            values,
          }
        }),
      )
      return productsWithRelations as Product[]
    }
  } catch (error) {
    handleError(error, 'listar', 'produtos')
  }
}

async function getByAccreditor(accreditorId: number) {
  try {
    const products = await fetchAllPages<ProductDTO>(
      api,
      '/products/accreditors',
      {
        accreditorId,
      },
    )
    return products
  } catch (error) {
    handleError(error, 'listar', 'produtos')
  }
}

async function getByProductGroup(productGroupId: number) {
  try {
    const products = await fetchAllPages<ProductDTO>(api, '/products/groups', {
      productGroupId,
    })
    return products
  } catch (error) {
    handleError(error, 'listar', 'produtos')
  }
}

export const productService = {
  create,
  getById,
  update,
  getAll,
  deleteById,
  getAllWithRelations,
  getByAccreditor,
  getByProductGroup,
}
