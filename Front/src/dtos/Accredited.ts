import { STATUS } from './defaults'

export interface AccreditedDTO {
  accreditorId: number
  status: STATUS
  companyId: number
  contactName?: string
  contactPhoneNumber?: string
  contactEmail?: string
  readonly credential: string
  readonly id: number
  readonly uuid: string
  readonly createAt: string
  readonly createBy: string
  readonly updateAt?: string
  readonly updateBy?: string
}

export type AccreditedInputDTO = Omit<
  AccreditedDTO,
  | 'id'
  | 'uuid'
  | 'createAt'
  | 'updateAt'
  | 'updateBy'
  | 'createBy'
  | 'credential'
>
