import { STATUS } from './defaults'

export interface ValueDTO {
  productId: number
  valueProduct: number
  valueCoparticipation: number
  effectiveDate: string
  accreditorId: number
  status: STATUS
  readonly id: number
  readonly createAt: string
  readonly createBy: string
  readonly updateAt?: string
  readonly updateBy?: string
}

export type ValueInputDTO = Omit<
  ValueDTO,
  'id' | 'createAt' | 'updateAt' | 'updateBy' | 'createBy'
>
