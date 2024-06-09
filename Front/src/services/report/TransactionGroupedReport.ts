import { TransactionDTO } from '@/dtos/Transaction'
import { header, color, noColor, footer } from './styles'
import { CellObject } from 'sheetjs-style'
import { writeWorkBook } from './writeWorkBook'
import { groupAndSumReports } from './groupTransactions'
import _ from 'lodash'
import { formatDate } from '@/func/formmatter'

const columnHeader = [
  'Data',
  'Local',
  'Produto',
  'Grupo',
  'Valor Total',
  'Total Pago',
  'Diferença',
  'Qtde Vendida',
]

export function exportReport(transactions: TransactionDTO[]) {
  const transactionsGrouped = groupAndSumReports(transactions)
  const data: CellObject[][] = []

  const headers: CellObject[] = columnHeader.map((item) => {
    return {
      t: 's',
      v: item,
      s: header,
    }
  })

  data.push(headers)

  transactionsGrouped.map((item, index) => {
    const date = formatDate(new Date(item.date))
    return data.push([
      {
        t: 's',
        v: date,
        s: index % 2 > 0 ? noColor : color,
      },
      {
        t: 's',
        v: item.accreditedCompanyName,
        s: index % 2 > 0 ? noColor : color,
      },
      {
        t: 's',
        v: item.product,
        s: index % 2 > 0 ? noColor : color,
      },
      {
        t: 's',
        v: item.productGroup,
        s: index % 2 > 0 ? noColor : color,
      },
      {
        t: 'n',
        v: item.totalValue,
        z: 'R$ 0.00',
        s: index % 2 > 0 ? noColor : color,
      },
      {
        t: 'n',
        v: item.totalPaid,
        z: 'R$ 0.00',
        s: index % 2 > 0 ? noColor : color,
      },

      {
        t: 'n',
        v: item.difference,
        z: 'R$ 0.00',
        s: index % 2 > 0 ? noColor : color,
      },

      {
        t: 'n',
        z: '0',
        v: item.soldQuantity,
        s: index % 2 > 0 ? noColor : color,
      },
    ])
  })

  const footers: CellObject[] = [
    {
      t: 's',
      v: '',
      s: footer,
    },
    {
      t: 's',
      v: '',
      s: footer,
    },
    {
      t: 's',
      v: '',
      s: footer,
    },
    {
      t: 's',
      v: '',
      s: footer,
    },
    {
      t: 'n',
      v: _.sumBy(transactionsGrouped, 'totalValue'),
      z: 'R$ 0.00',
      s: footer,
    },
    {
      t: 'n',
      v: _.sumBy(transactionsGrouped, 'totalPaid'),
      z: 'R$ 0.00',
      s: footer,
    },

    {
      t: 'n',
      v: _.sumBy(transactionsGrouped, 'difference'),
      z: 'R$ 0.00',
      s: footer,
    },

    {
      t: 'n',
      z: '0',
      v: _.sumBy(transactionsGrouped, 'soldQuantity'),
      s: footer,
    },
  ]

  data.push(footers)
  writeWorkBook({
    data,
    fileName: 'Resumo de Vendas do Periodo.xlsx',
    worksheetName: 'Transações',
  })
}
