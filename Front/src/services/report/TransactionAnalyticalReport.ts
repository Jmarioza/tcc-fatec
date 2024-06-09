import { TransactionDTO } from '@/dtos/Transaction'
import { header, footer, color, noColor } from './styles'
import { CellObject } from 'sheetjs-style'
import { writeWorkBook } from './writeWorkBook'
import _ from 'lodash'
import { formatCPF } from '@/func/formmatter'

const columnHeader = [
  'Id',
  'Data',
  'Hora',
  'Local',
  'Produto',
  'Grupo',
  'Total de Produto',
  'Total Pago ',
  'Diferença',
  // 'Taxa Adm',
  'Quantidade',
  'CPF',
  'Beneficiário',
  'Grupo Beneficiário',
  'Subgrupo Beneficiário',
]

export function exportReport(transactions: TransactionDTO[]) {
  const data: CellObject[][] = []

  transactions = transactions.filter((item) => item.statusTransaction === 'OK')

  const headers: CellObject[] = columnHeader.map((item) => {
    return {
      t: 's',
      v: item,
      s: header,
    }
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
      z: 'R$ 0.00',
      v: _.sumBy(transactions, 'totalValueProduct'),
      s: footer,
    },
    {
      t: 'n',
      z: 'R$ 0.00',
      v: _.sumBy(transactions, 'totalValueCoparticipation'),
      s: footer,
    },
    {
      t: 'n',
      z: 'R$ 0.00',
      v: transactions.reduce((accumulator, item) => {
        accumulator += item.totalValueProduct - item.totalValueCoparticipation
        return accumulator
      }, 0),
      s: footer,
    },
    {
      t: 'n',
      z: '0',
      v: _.sumBy(transactions, 'quantity'),
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
      t: 's',
      v: '',
      s: footer,
    },
  ]

  data.push(headers)

  transactions.map((item, index) => {
    const localeDate = new Date(item.dateTime)
    const date = localeDate.toLocaleDateString('pt-Br', {
      dateStyle: 'short',
    })
    const time = localeDate.toLocaleTimeString('pt-Br', {
      timeStyle: 'short',
    })

    return data.push([
      {
        t: 's',
        v: item.id,
        s: index % 2 > 0 ? noColor : color,
      },
      {
        t: 's',
        v: date,
        s: index % 2 > 0 ? noColor : color,
      },
      {
        t: 's',
        v: time,
        s: index % 2 > 0 ? noColor : color,
      },
      {
        t: 's',
        v: item.accredited.company.name,
        s: index % 2 > 0 ? noColor : color,
      },
      {
        t: 's',
        v: item.product.name,
        s: index % 2 > 0 ? noColor : color,
      },
      {
        t: 's',
        v: item.productGroup.name,
        s: index % 2 > 0 ? noColor : color,
      },
      {
        t: 'n',
        z: 'R$ 0.00',
        v: item.totalValueProduct,
        s: index % 2 > 0 ? noColor : color,
      },
      {
        t: 'n',
        z: 'R$ 0.00',
        v: item.totalValueCoparticipation,
        s: index % 2 > 0 ? noColor : color,
      },
      {
        t: 'n',
        z: 'R$ 0.00',
        v: item.totalValueProduct - item.totalValueCoparticipation,
        s: index % 2 > 0 ? noColor : color,
      },
      {
        t: 'n',
        z: '0',
        v: item.quantity,
        s: index % 2 > 0 ? noColor : color,
      },
      {
        t: 's',
        v: formatCPF(item.beneficiary.cpf),
        s: index % 2 > 0 ? noColor : color,
      },
      {
        t: 's',
        v: item.beneficiary.name,
        s: index % 2 > 0 ? noColor : color,
      },
      {
        t: 's',
        v: item.beneficiary.beneficiaryGroup.name,
        s: index % 2 > 0 ? noColor : color,
      },
      {
        t: 's',
        v: item.beneficiary.beneficiarySubgroup.name,
        s: index % 2 > 0 ? noColor : color,
      },
    ])
  })

  data.push(footers)

  writeWorkBook({
    data,
    fileName: 'Movimento de Vendas do Periodo.xlsx',
    worksheetName: 'Transações',
  })
}
