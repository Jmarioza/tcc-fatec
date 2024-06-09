import { STATUS } from './defaults'

export interface ServiceContractDTO {
  accreditorId: number
  serviceId: number
  statusContract: STATUS
  commission?: number
  commissionType?: 'PERCENTAGE' | 'VALUE'
  maximumCharge?: number
  readonly id: number
  readonly uuid: string
  readonly createAt: string
  readonly createBy: string
  readonly updateAt?: string
  readonly updateBy?: string
}

export type ServiceContractInputDTO = Omit<
  ServiceContractDTO,
  'id' | 'uuid' | 'createAt' | 'updateAt' | 'updateBy' | 'createBy'
>
