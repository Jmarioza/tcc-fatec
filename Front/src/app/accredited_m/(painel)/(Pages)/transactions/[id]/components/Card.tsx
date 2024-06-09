import * as S from './styles'
import { TransactionDTO } from '@/dtos/Transaction'

interface CardProps {
  transaction: TransactionDTO
}

export function TransactionCard({ transaction }: CardProps) {
  return (
    <S.Container>
      <div>
        <h4>{transaction.product.name}</h4>
        <p>{transaction.productGroup.name}</p>
      </div>
      <div>
        <p>x{transaction.quantity}</p>
        <p>
          Valor unitário:{' '}
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(transaction.valueProduct)}
        </p>
        <p>
          Valor Coparticipação:{' '}
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(transaction.valueCoparticipation)}
        </p>
        <hr />
        <p>
          Total Produto:{' '}
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(transaction.totalValueProduct)}
        </p>{' '}
        <p>
          Total Coparticipação:{' '}
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(transaction.totalValueCoparticipation)}
        </p>
      </div>
    </S.Container>
  )
}
