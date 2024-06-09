import { STATUS } from './defaults'

export interface ServiceHabilitDTO {
  id: {
    accreditedId: number
    contractId: number
  }
  status: STATUS
  readonly createAt: string
  readonly createBy: string
  readonly updateAt?: string
  readonly updateBy?: string
}

export type ServiceHabilitInputDTO = Omit<
  ServiceHabilitDTO,
  'createAt' | 'updateAt' | 'updateBy' | 'createBy'
>
