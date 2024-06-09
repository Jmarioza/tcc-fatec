import { STATUS } from './defaults'

export interface UserDTO {
  name: string
  username: string
  password: string
  status: STATUS
  readonly id: number
  readonly uuid: string
  readonly createAt: string
  readonly createBy: string
  readonly updateAt?: string
  readonly updateBy?: string
}

export type UserInputDTO = Omit<
  UserDTO,
  'id' | 'uuid' | 'createAt' | 'updateAt' | 'updateBy' | 'createBy'
>
