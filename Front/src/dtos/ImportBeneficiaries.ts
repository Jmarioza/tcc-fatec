export type BeneficiaryImportDTO = {
  nome: string
  cpf: string
  matricula: string
  campus: string
  unidade: string
  curso: string
  situacao: string
}

export type BeneficiaryErrors = {
  beneficiaryData: Partial<BeneficiaryImportDTO>
  errors: string[]
}

export interface ImportBeneficiariesRequestDTO {
  accreditorId: number
  beneficiaryData: BeneficiaryImportDTO[]
}

export interface ImportBeneficiariesResponseDTO {
  success: boolean
  totalImported: number
  beneficiaryErrors: BeneficiaryErrors[]
}
