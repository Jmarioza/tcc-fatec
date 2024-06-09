export interface PetsDto {
  nome: string
  porte: string
  especie: string
  pessoa_responsavel: string
  readonly id: number
}

export type PetsImputDto = Omit<PetsDto, 'id'>
