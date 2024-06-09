import { STATUS } from './defaults'

export type SERVICE_TYPE = 'BENEFIT' | 'AGREEMENT' | 'LOYALTY'

export interface ServiceTypeDTO {
  name: string
  type: SERVICE_TYPE
  status: STATUS
  readonly id: number
  readonly uuid: string
  readonly createAt: string
  readonly createBy: string
  readonly updateAt?: string
  readonly updateBy?: string
}

export type ServiceTypeInputDTO = Omit<
  ServiceTypeDTO,
  'id' | 'uuid' | 'createAt' | 'updateAt' | 'updateBy' | 'createBy'
>
