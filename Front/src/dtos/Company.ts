import { STATUS } from './defaults'

export interface CompanyDTO {
  name?: string
  status: STATUS
  typePerson: 'PHYSICAL' | 'LEGAL'
  cnpj?: string
  ie?: string
  cpf?: string
  rg?: string
  cnae?: string
  im?: string
  taxRegime: 'NORMAL_REGIME' | 'SIMPLE_NATIONAL'
  personResponsible?: string
  cpfPersonResponsible?: string
  corporateReason: string
  phoneNumber?: string
  extension?: string
  address?: string
  addressNumber?: string
  neighborhood?: string
  complement?: string
  city?: string
  uf?: string
  country?: string
  cep?: string
  email?: string
  site?: string
  duns?: string
  readonly id: number
  readonly uuid: string
  readonly createAt: string
  readonly createBy: string
  readonly updateAt?: string
  readonly updateBy?: string
}

export type CompanyInputDTO = Omit<
  CompanyDTO,
  'id' | 'uuid' | 'createAt' | 'updateAt' | 'updateBy' | 'createBy'
>
