import { ComponentProps, ReactNode } from 'react'
import * as S from './styles'

interface Props extends ComponentProps<'div'> {
  children: ReactNode
}

export function Container({ children, ...rest }: Props) {
  return <S.Container {...rest}>{children}</S.Container>
}
