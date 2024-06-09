import { ProductDTO } from './Product'
import { ProductGroupDTO } from './ProductGroup'

export interface TransactionDTO {
  id: number
  uuid: string
  dateTime: string
  accreditorId: number
  accreditedId: number
  accredited: {
    id: number
    company: {
      name: string
      corporateReason: string
      id: number
    }
  }
  transactionType: 'AUTHORIZATION' | 'CANCELLATION'
  commission: number
  localDateTime: string
  localTransaction: string
  localTransactionPoint: string
  localTransactionReference: string
  product: ProductDTO
  productGroup: ProductGroupDTO
  valueProduct: number
  valueCoparticipation: number
  quantity: number
  totalValueProduct: number
  totalValueCoparticipation: number
  beneficiary: {
    id: number
    name: string
    cpf: string
    codeRef: string
    beneficiaryGroup: {
      id: number
      name: string
      tag: string
    }
    beneficiarySubgroup: {
      id: number
      name: string
      beneficiaryGroupId: number
      tag: string
    }
  }
  cpfBeneficiary: string
  credential: string
  statusTransaction: 'OK' | 'CANCELED'
}
