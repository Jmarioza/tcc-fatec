export interface FuncionariosDto {
  nome: string
  endereco: string
  endnum: string
  uf: string
  cidade: string
  bairro: string
  cep: string
  rg: string
  pessoa_responsavel: string
  telefone: string
  email: string
  cpf: string
  readonly id: number
  readonly tenant_id: number
}
export type PetsImputDto = Omit<FuncionariosDto, 'id' | 'tenant_id'>
