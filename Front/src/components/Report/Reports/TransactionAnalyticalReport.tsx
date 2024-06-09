import { ReportContainer } from '@/components/Report/Container'
import { ReportHeader } from '@/components/Report/Header'
import { Table } from '@/components/Report/Table'
import { TableRow } from '@/components/Report/Table/Row'
import { TableBody } from '@/components/Report/Table/Body'
import { TransactionDTO } from '@/dtos/Transaction'
import { TableCell } from '@/components/Report/Table/Cell'
import { TableHeader } from '@/components/Report/Table/Header'
import { formatCPF, hideCPF } from '@/func/formmatter'
import { TableFooter } from '@/components/Report/Table/Footer'
import _ from 'lodash'
import { addDays } from 'date-fns'
import { Footer } from '../Footer'
import { authService } from '@/services/authService'

interface TransactionAnalyticalReportProps {
  transactions: TransactionDTO[]
  dateStart: string
  dateEnd: string
}

export function TransactionAnalyticalReport({
  transactions,
  dateEnd,
  dateStart,
}: TransactionAnalyticalReportProps) {
  function formatDate(date: string) {
    const dateWithoutTimeZone = new Date(date)
    const dateWithTimezone = addDays(dateWithoutTimeZone, 1)
    return dateWithTimezone.toLocaleDateString('pt-BR')
  }

  const { typeUser } = authService.getUserAuth()

  return (
    <ReportContainer orientation="landscape">
      <ReportHeader
        title="Analítico de Transações"
        dateStart={formatDate(dateStart)}
        dateEnd={formatDate(dateEnd)}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell style={{ width: 20 }}>Id</TableCell>
            <TableCell style={{ width: 40 }}>Data</TableCell>
            <TableCell style={{ width: 30 }}>Hora</TableCell>
            <TableCell style={{ width: 110 }}>Local</TableCell>
            <TableCell style={{ width: 60 }}>CPF</TableCell>
            <TableCell style={{ width: 140 }}>Beneficiário</TableCell>
            <TableCell style={{ width: 30 }}>Grupo</TableCell>
            <TableCell style={{ width: 210, overflow: 'hidden' }}>
              Produto
            </TableCell>
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
            {transactions.map((transaction, index) => (
              <TableRow key={transaction.id} color={index % 2 > 0}>
                <TableCell style={{ width: 20 }}>{transaction.id}</TableCell>
                <TableCell style={{ width: 40, textAlign: 'left' }}>
                  {new Date(transaction.dateTime).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell style={{ width: 30 }}>
                  {new Date(transaction.dateTime).toLocaleTimeString('pt-BR')}
                </TableCell>
                <TableCell style={{ width: 110 }}>
                  {transaction.accredited.company.name}
                </TableCell>

                <TableCell style={{ width: 60 }}>
                  {['SYSTEM', 'LIMITED_ACCREDITOR', 'ACCREDITOR'].includes(
                    typeUser,
                  )
                    ? formatCPF(transaction.beneficiary.cpf)
                    : hideCPF(transaction.beneficiary.cpf)}
                </TableCell>
                <TableCell style={{ width: 140 }}>
                  {transaction.beneficiary.name}
                </TableCell>
                <TableCell style={{ width: 30 }}>
                  {transaction.beneficiary.beneficiaryGroup.tag}
                </TableCell>
                <TableCell
                  style={{
                    width: 210,
                    overflow: 'hidden',
                    flexWrap: 'nowrap',
                  }}
                >
                  {transaction.product.name}
                </TableCell>
                <TableCell style={{ width: 50, alignItems: 'flex-end' }}>
                  {transaction.totalValueProduct.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </TableCell>
                <TableCell style={{ width: 50, alignItems: 'flex-end' }}>
                  {transaction.totalValueCoparticipation.toLocaleString(
                    'pt-BR',
                    {
                      style: 'currency',
                      currency: 'BRL',
                    },
                  )}
                </TableCell>
                <TableCell style={{ width: 50, alignItems: 'flex-end' }}>
                  {(
                    transaction.totalValueProduct -
                    transaction.totalValueCoparticipation
                  ).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </TableCell>
              </TableRow>
            ))}
            <TableFooter>
              <TableRow>
                <TableCell style={{ width: 670 }}>{<></>}</TableCell>
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
                  isFooter
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
