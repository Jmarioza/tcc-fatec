'use client'
import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/useToast'
import { TransactionDTO } from '@/dtos/Transaction'
import { Container } from '@/components/Container'
import { CustomBox } from '@/components/CustomBox'
import { Footer } from '@/components/Footer'
import { ReasonModal } from '@/components/ReasonModal'
import { Info } from '@/components/Info'
import { transactionsService } from '@/services/transactionsService'
import { Accreditor, accreditorService } from '@/services/accreditorService'
import { Button, Divider } from '@mui/material'
import { Cancel, Restore } from '@mui/icons-material'
import { GridBox } from '@/components/GridBox'
import { TransactionOccurrence } from '../components/TransactionOccurrence'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'
import { formatCPF } from '@/func/formmatter'

interface Props {
  params: {
    id: number
  }
}

type ActionType = 'RESTORE' | 'CANCEL'

export default function TransactionDetailPage({ params: { id } }: Props) {
  const [transaction, setTransaction] = useState<TransactionDTO>()
  const [accreditor, setAccreditor] = useState<Accreditor>()
  const [actionType, setActionType] = useState<ActionType>()
  const toast = useToast()

  async function fetchTransaction() {
    try {
      const data = await transactionsService.getById(id)
      if (data) {
        setTransaction(data)
        const accreditorData = await accreditorService.getByIdWithCompany(
          data.accreditorId,
        )
        if (accreditorData) setAccreditor(accreditorData)
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  useEffect(() => {
    if (!actionType) {
      fetchTransaction()
    }
  }, [actionType])

  return (
    <Container>
      <NavigationContainer>
        <Breadcrumb
          crumbs={[
            {
              href: '/accreditor',
              description: 'Home',
            },
            {
              href: '/accreditor/transactions',
              description: 'Transações',
            },
            {
              description: 'Detalhes',
            },
          ]}
        />
      </NavigationContainer>
      {actionType && (
        <ReasonModal
          handleClose={() => setActionType(undefined)}
          isOpen={!!actionType}
          actionType={actionType}
          transactionId={id}
        />
      )}

      <CustomBox title="Detalhe da Transação">
        <GridBox column={18}>
          <Info title="Transação" description={String(transaction?.id)} />
          <Info
            title="Data e Hora"
            style={{ gridColumn: 'span 3' }}
            description={
              transaction?.dateTime
                ? new Intl.DateTimeFormat('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  }).format(new Date(String(transaction.dateTime)))
                : ''
            }
          />
          <Info
            title="Tipo da transação"
            style={{ gridColumn: 'span 3' }}
            description={
              transaction?.transactionType === 'AUTHORIZATION'
                ? 'Autorização'
                : 'Cancelamento'
            }
          />

          <Info
            title="Credenciadora"
            description={accreditor?.company?.name}
            style={{ gridColumn: 'span 10' }}
          />
          <Info
            title="Situação"
            description={
              transaction?.statusTransaction === 'OK'
                ? 'Concluído'
                : 'Cancelado'
            }
          />
        </GridBox>
        <Divider />
        <GridBox column={18}>
          <Info
            title="Local"
            description={transaction?.accredited.company.name}
            style={{ gridColumn: 'span 4' }}
          />
          <Info
            title="Identificador PDV"
            style={{ gridColumn: 'span 3' }}
            description={transaction?.localTransaction}
          />
          <Info
            title="Data e Hora PDV"
            style={{ gridColumn: 'span 3' }}
            description={
              transaction?.localDateTime
                ? new Intl.DateTimeFormat('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  }).format(new Date(String(transaction.localDateTime)))
                : ''
            }
          />
          <Info
            title="Referência"
            style={{ gridColumn: 'span 5' }}
            description={transaction?.localTransactionReference}
          />
          <Info
            title="Ponto de Venda"
            style={{ gridColumn: 'span 3' }}
            description={transaction?.localTransactionPoint}
          />
        </GridBox>
        <Divider />
        <GridBox column={16}>
          <Info
            title="Beneficiário"
            style={{ gridColumn: 'span 3' }}
            description={transaction?.beneficiary.name}
          />

          <Info
            title="CPF"
            style={{ gridColumn: 'span 2' }}
            description={
              transaction?.beneficiary.cpf &&
              formatCPF(transaction?.beneficiary.cpf)
            }
          />
          <Info
            title="Matricula"
            style={{ gridColumn: 'span 2' }}
            description={transaction?.beneficiary.codeRef}
          />
          <Info
            title="Grupo"
            style={{ gridColumn: 'span 5' }}
            description={transaction?.beneficiary.beneficiaryGroup.name}
          />
          <Info
            title="SubGrupo"
            style={{ gridColumn: 'span 4' }}
            description={transaction?.beneficiary.beneficiarySubgroup.name}
          />
        </GridBox>
        <Divider />
        <GridBox column={18}>
          <Info title="Item" description={String(transaction?.product.id)} />
          <Info
            title="Código"
            description={transaction?.product.code}
            style={{ gridColumn: 'span 2' }}
          />
          <Info
            title="Descrição"
            description={transaction?.product.name}
            style={{ gridColumn: 'span 4' }}
          />
          <Info
            title="Grupo"
            description={transaction?.productGroup.name}
            style={{ gridColumn: 'span 3' }}
          />
          <Info
            title="Quantidade"
            description={`x ${transaction?.quantity}`}
            style={{ gridColumn: 'span 2' }}
          />
          <Info
            title="Valor"
            style={{ gridColumn: 'span 2' }}
            description={transaction?.totalValueProduct.toLocaleString(
              'pt-Br',
              {
                style: 'currency',
                currency: 'BRL',
              },
            )}
          />
          <Info
            title="Coparticipação"
            style={{ gridColumn: 'span 2' }}
            description={transaction?.totalValueCoparticipation.toLocaleString(
              'pt-Br',
              {
                style: 'currency',
                currency: 'BRL',
              },
            )}
          />
          <Info
            title="Taxa Adm"
            style={{ gridColumn: 'span 2' }}
            description={transaction?.commission.toLocaleString('pt-Br', {
              style: 'currency',
              currency: 'BRL',
            })}
          />
        </GridBox>
      </CustomBox>

      <Footer>
        {transaction?.statusTransaction === 'OK' ? (
          <Button
            startIcon={<Cancel />}
            variant="contained"
            onClick={() => setActionType('CANCEL')}
          >
            Cancelar
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<Restore />}
            onClick={() => setActionType('RESTORE')}
          >
            Restaurar
          </Button>
        )}
      </Footer>
      <TransactionOccurrence transactionId={transaction?.id} />
    </Container>
  )
}
