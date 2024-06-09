import { STATUS } from './defaults'

export interface AccreditorDTO {
  status: STATUS
  companyId: number
  readonly id: number
  readonly uuid: string
  readonly createAt: string
  readonly createBy: string
  readonly updateAt?: string
  readonly updateBy?: string
}

export type AccreditorInputDTO = Omit<
  AccreditorDTO,
  'id' | 'uuid' | 'createAt' | 'updateAt' | 'updateBy' | 'createBy'
>
