import { ComponentProps, ReactNode } from 'react'
import * as S from './styles'
import { useRouter } from 'next/navigation'
import { IconButton } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

interface Props extends ComponentProps<'div'> {
  children: ReactNode
}
export function NavigationContainer({ children, ...rest }: Props) {
  const { push } = useRouter()

  return (
    <S.Container {...rest}>
      <IconButton onClick={() => push('./')}>
        <ArrowBack />
      </IconButton>
      {children}
    </S.Container>
  )
}
