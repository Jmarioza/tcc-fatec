import { STATUS } from './defaults'

export interface BeneficiaryGroupDTO {
  name: string
  status: STATUS
  accreditorId: number
  tag?: string
  readonly id: number
  readonly uuid: string
  readonly createAt: string
  readonly createBy: string
  readonly updateAt?: string
  readonly updateBy?: string
}

export type BeneficiaryGroupInputDTO = Omit<
  BeneficiaryGroupDTO,
  'id' | 'uuid' | 'createAt' | 'updateAt' | 'updateBy' | 'createBy'
>
