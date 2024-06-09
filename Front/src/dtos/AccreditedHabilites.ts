import { STATUS } from './defaults'

export interface AccreditedHabilites {
  contractId: number
  serviceName: string
  contractAccreditor: number
  contractStatus: STATUS
  contractService: number
  habilitStatus: STATUS | null
  habilitAccredited: number | null
  habilitUpdateBy: string | null
  habilitCreateBy: number | null
  habilitContract: number | null
  habilitCreateAt: string | null
  habilitUpdateAt: string | null
}
