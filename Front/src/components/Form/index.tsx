import { ComponentProps, ReactNode } from 'react'
import * as S from './styles'

interface Props extends ComponentProps<'form'> {
  children: ReactNode
}

export function Form({ children, ...rest }: Props) {
  return <S.Container {...rest}>{children}</S.Container>
}
