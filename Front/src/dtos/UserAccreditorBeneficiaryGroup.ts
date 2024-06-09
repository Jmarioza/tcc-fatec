export interface UserAccreditorBeneficiaryGroupInputDTO {
  id: {
    userId: number
    accreditorId: number
    beneficiaryGroupId: number
  }
}

export interface UserAccreditorBeneficiaryGroupOutputDTO {
  userId: number
  accreditorId: number
  beneficiaryGroupId: number
  beneficiaryGroupName: string
  beneficiaryGroupTag: string
}
