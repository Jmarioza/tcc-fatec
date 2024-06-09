import { STATUS } from './defaults'

export interface BeneficiarySubGroupDTO {
  beneficiaryGroupId: number
  accreditorId: number
  name: string
  tag?: string
  status: STATUS
  readonly id: number
  readonly uuid: string
  readonly createAt: string
  readonly createBy: string
  readonly updateAt?: string
  readonly updateBy?: string
}

export type BeneficiarySubGroupInputDTO = Omit<
  BeneficiarySubGroupDTO,
  'id' | 'uuid' | 'createAt' | 'updateAt' | 'updateBy' | 'createBy'
>
