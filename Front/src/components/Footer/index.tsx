import { ReactNode, ComponentProps } from 'react'
import * as S from './styles'

interface Props extends ComponentProps<'footer'> {
  children: ReactNode
}

export function Footer({ children, ...rest }: Props) {
  return <S.Container {...rest}>{children}</S.Container>
}
