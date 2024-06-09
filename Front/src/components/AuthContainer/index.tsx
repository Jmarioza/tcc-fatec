import { ComponentProps, ReactNode } from 'react'
import * as S from './styles'

interface AuthContainerProps extends ComponentProps<'div'> {
  children: ReactNode
}

export function AuthContainer({
  children,
  title,
  ...rest
}: AuthContainerProps) {
  return (
    <S.Container {...rest}>
      <S.Content>
        <S.Title>{title}</S.Title>
        <S.FormContent>{children}</S.FormContent>
      </S.Content>
    </S.Container>
  )
}
