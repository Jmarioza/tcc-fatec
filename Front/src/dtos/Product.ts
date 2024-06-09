import { STATUS } from './defaults'

export interface ProductDTO {
  name: string
  code: string
  productGroupId: number
  accreditorId: number
  status: STATUS
  obs?: string
  readonly id: number
  readonly uuid: string
  readonly createAt: string
  readonly createBy: string
  readonly updateAt?: string
  readonly updateBy?: string
}

export type ProductInputDTO = Omit<
  ProductDTO,
  'id' | 'uuid' | 'createAt' | 'updateAt' | 'updateBy' | 'createBy'
>
