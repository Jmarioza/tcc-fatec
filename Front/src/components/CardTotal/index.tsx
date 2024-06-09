import { ReactElement } from 'react'
import * as S from './styles'

interface Props {
  title: string
  amount?: number
  quantity?: number
  Icon: ReactElement
}

export function CardTotal({ amount, title, quantity, Icon }: Props) {
  return (
    <S.Container>
      <S.Header>
        <S.Title>{title}</S.Title>
        {Icon}
      </S.Header>
      <S.Amount>
        {amount &&
          new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(amount)}
        {quantity && quantity}
      </S.Amount>
    </S.Container>
  )
}
