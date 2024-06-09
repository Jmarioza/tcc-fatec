export interface AtedimentoDto {
  nome: string
  sintoma: string
  receita: string
  readonly id: number
}
export type AtendimentoImputDto = Omit<AtedimentoDto, 'id'>
