import { STATUS } from './defaults'

export interface ProductGroupDTO {
  name: string
  accreditorId: number
  status: STATUS
  readonly id: number
  readonly uuid: string
  readonly createAt: string
  readonly createBy: string
  readonly updateAt?: string
  readonly updateBy?: string
}

export type ProductGroupInputDTO = Omit<
  ProductGroupDTO,
  'id' | 'uuid' | 'createAt' | 'updateAt' | 'updateBy' | 'createBy'
>
