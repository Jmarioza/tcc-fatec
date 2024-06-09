import { ReportContainer } from '@/components/Report/Container'
import { ReportHeader } from '@/components/Report/Header'
import { Table } from '@/components/Report/Table'
import { TableRow } from '@/components/Report/Table/Row'
import { TableBody } from '@/components/Report/Table/Body'
import { TransactionDTO } from '@/dtos/Transaction'
import { TableCell } from '@/components/Report/Table/Cell'
import { TableHeader } from '@/components/Report/Table/Header'
import { TableFooter } from '@/components/Report/Table/Footer'
import _ from 'lodash'
import { groupAndSumReports } from '@/services/report/groupTransactions'
import { addDays } from 'date-fns'
import { Footer } from '../Footer'

interface TransactionConsolidatedReportProps {
  transactions: TransactionDTO[]
  dateStart: string
  dateEnd: string
}

export function TransactionConsolidatedReport({
  transactions,
  dateEnd,
  dateStart,
}: TransactionConsolidatedReportProps) {
  const transactionsGrouped = groupAndSumReports(transactions)
  function formatDate(date: string) {
    const dateWithoutTimeZone = new Date(date)
    const dateWithTimezone = addDays(dateWithoutTimeZone, 1)
    return dateWithTimezone.toLocaleDateString('pt-BR')
  }

  return (
    <ReportContainer orientation="portrait">
      <ReportHeader
        title="Consolidado de Transações"
        dateStart={formatDate(dateStart)}
        dateEnd={formatDate(dateEnd)}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell style={{ width: 40 }}>Data</TableCell>
            <TableCell style={{ width: 130 }}>Local</TableCell>
            <TableCell style={{ width: 240 }}>Produto</TableCell>
            <TableCell style={{ width: 50, alignItems: 'flex-end' }}>
              Total Produto
            </TableCell>
            <TableCell style={{ width: 50, alignItems: 'flex-end' }}>
              Total Pago
            </TableCell>
            <TableCell style={{ width: 50, alignItems: 'flex-end' }}>
              Diferença
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableHeader>
          <TableBody>
            {transactionsGrouped.map((transaction, index) => (
              <TableRow key={index} color={index % 2 > 0}>
                <TableCell style={{ width: 40 }}>
                  {formatDate(transaction.date)}
                </TableCell>
                <TableCell style={{ width: 130 }}>
                  {transaction.accreditedCompanyName}
                </TableCell>
                <TableCell
                  style={{
                    width: 240,
                  }}
                >
                  {transaction.product}
                </TableCell>
                <TableCell style={{ width: 50, alignItems: 'flex-end' }}>
                  {transaction.totalValue.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </TableCell>
                <TableCell style={{ width: 50, alignItems: 'flex-end' }}>
                  {transaction.totalPaid.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </TableCell>
                <TableCell style={{ width: 50, alignItems: 'flex-end' }}>
                  {(
                    transaction.totalValue - transaction.totalPaid
                  ).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </TableCell>
              </TableRow>
            ))}
            <TableFooter>
              <TableRow>
                <TableCell style={{ width: 420 }}>{<></>}</TableCell>
                <TableCell
                  style={{ width: 50, alignItems: 'flex-end' }}
                  isFooter
                >
                  {_.sumBy(transactions, 'totalValueProduct').toLocaleString(
                    'pt-BR',
                    {
                      style: 'currency',
                      currency: 'BRL',
                    },
                  )}
                </TableCell>
                <TableCell
                  style={{ width: 50, alignItems: 'flex-end' }}
                  isFooter
                >
                  {_.sumBy(
                    transactions,
                    'totalValueCoparticipation',
                  ).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </TableCell>
                <TableCell
                  style={{ width: 50, alignItems: 'flex-end' }}
                  isFooter={true}
                >
                  {(
                    _.sumBy(transactions, 'totalValueProduct') -
                    _.sumBy(transactions, 'totalValueCoparticipation')
                  ).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </TableCell>
              </TableRow>
            </TableFooter>
          </TableBody>
        </TableHeader>
      </Table>
      <Footer />
    </ReportContainer>
  )
}
