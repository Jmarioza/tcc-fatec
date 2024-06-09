import { STATUS } from './defaults'

export type TypeUser =
  | 'SYSTEM'
  | 'BENEFICIARY'
  | 'ACCREDITED'
  | 'MASTER_ACCREDITED'
  | 'ACCREDITOR'
  | 'LIMITED_ACCREDITOR'

export type UserRole = {
  userId: number
  companyId: number
  typeUser: TypeUser
}

export interface UserRolesDTO {
  id: UserRole
  status: STATUS
  readonly createAt: string
  readonly createBy: string
  readonly updateAt?: string
  readonly updateBy?: string
}

export type UserRolesInputDTO = Omit<
  UserRolesDTO,
  'createAt' | 'updateAt' | 'updateBy' | 'createBy'
>
