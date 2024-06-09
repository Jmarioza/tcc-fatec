export interface ClientesDto {
  nome: string
  rg: string
  cpf: string
  cnpj: string
  email: string
  telefone: string
  cidade: string
  uf: string
  bairro: string
  cep: string
  readonly id: number
}
export type PetsImputDto = Omit<ClientesDto, 'id'>
