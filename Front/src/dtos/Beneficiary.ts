import { STATUS } from './defaults'

export interface BeneficiaryDTO {
  name: string
  cpf: string
  beneficiaryGroupId: number
  beneficiarySubgroupId: number
  accreditorId: number
  codeRef?: string
  status: STATUS
  readonly id: number
  readonly uuid: string
  readonly createAt: string
  readonly createBy: string
  readonly updateAt?: string
  readonly updateBy?: string
}

export type BeneficiaryInputDTO = Omit<
  BeneficiaryDTO,
  'id' | 'uuid' | 'createAt' | 'updateAt' | 'updateBy' | 'createBy'
>
