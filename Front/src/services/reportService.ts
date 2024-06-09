import { handleError } from './errors/errorHandler'
import { downloadFile } from './utils/downloadFilte'
import { SearchParams } from './transactionsService'
import { TypeUser } from '@/dtos/UserRoles'

interface TransactionReportProps extends SearchParams {
  typeUser: TypeUser
}

async function analyticalTransactions(filter: TransactionReportProps) {
  try {
    await downloadFile(
      'transactions/analytical_report',
      'Analítico_de_Transação.pdf',
      filter,
    )
  } catch (error) {
    handleError(error, 'baixar', 'relatório analítico de transações')
  }
}

async function consolidatedTransactions(filter: TransactionReportProps) {
  try {
    await downloadFile(
      '/transactions/consolidated_report',
      'Consolidado_de_Transação.pdf',
      filter,
    )
  } catch (error) {
    handleError(error, 'baixar', 'relatório consolidado de transações')
  }
}

interface BeneficiariesProps {
  typeUser: TypeUser
}
async function beneficiaries(filter: BeneficiariesProps) {
  try {
    await downloadFile('/beneficiaries/report', 'Beneficiários.pdf', filter)
  } catch (error) {
    handleError(error, 'baixar', 'relatório de beneficiários.')
  }
}

interface ProductsReportProps {
  accreditorId: number
}
async function productsReport(filter: ProductsReportProps) {
  try {
    await downloadFile('/products/report', 'Produtos.pdf', filter)
  } catch (error) {
    handleError(error, 'baixar', 'relatório de Produtos.')
  }
}

interface BeneficiaryGroupsProps {
  accreditorId: number
}
async function BeneficiaryGroup(filter: BeneficiaryGroupsProps) {
  try {
    await downloadFile(
      '/beneficiary_groups/report',
      'Grupo_de_Beneficiários.pdf',
      filter,
    )
  } catch (error) {
    handleError(error, 'baixar', 'relatório de grupo de beneficiários.')
  }
}

export const reportService = {
  analyticalTransactions,
  consolidatedTransactions,
  beneficiaries,
  productsReport,
  BeneficiaryGroup,
}
