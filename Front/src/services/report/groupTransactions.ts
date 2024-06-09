import _ from 'lodash'
import { TransactionDTO } from '@/dtos/Transaction'

interface Export {
  date: string
  accreditedCompanyName: string
  product: string
  productGroup: string
  totalValue: number
  totalPaid: number
  difference: number
  // totalCommission: number
  soldQuantity: number
}

export function groupAndSumReports(reports: TransactionDTO[]): Export[] {
  const groupedReports = _.groupBy(
    reports.filter((item) => item.statusTransaction === 'OK'),
    (report) => {
      const localDate = report.dateTime.split('T')[0]
      return `${localDate}-${report.accredited.id}-${report.product.id}`
    },
  )

  return _.map(groupedReports, (groupedReportsForKey) => {
    const { dateTime, product, accredited, productGroup } =
      groupedReportsForKey[0]
    const totalValue = _.sumBy(groupedReportsForKey, 'totalValueProduct')
    const soldQuantity = _.sumBy(groupedReportsForKey, 'quantity')
    // const totalCommission = _.sumBy(groupedReportsForKey, 'commission')
    const totalPaid = _.sumBy(groupedReportsForKey, 'totalValueCoparticipation')
    const date = dateTime.split('T')[0]

    return {
      date,
      accreditedCompanyName: accredited.company.name,
      product: product.name,
      productGroup: productGroup.name,
      totalValue,
      totalPaid,
      difference: totalValue - totalPaid,
      // totalCommission,
      soldQuantity,
    }
  })
}
