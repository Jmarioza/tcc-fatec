import { ComponentProps, ReactNode } from 'react'
import * as S from './styles'

interface Props extends ComponentProps<'div'> {
  children: ReactNode
  column?: number
  row?: number
}
export function GridBox({ children, column = 1, row = 1, ...rest }: Props) {
  return (
    <S.Container
      style={{
        gridTemplateColumns: `repeat(${column}, 1fr)`,
        gridTemplateRows: `repeat(${row}, 1fr)`,
      }}
      {...rest}
    >
      {children}
    </S.Container>
  )
}
