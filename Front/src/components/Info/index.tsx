import { ComponentProps } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { IconButton } from '@mui/material'
import { Launch } from '@mui/icons-material'
import * as S from './styles'

interface Props extends ComponentProps<'div'> {
  title: string
  description?: string
  href?: string
}

export function Info({ description, title, href, ...rest }: Props) {
  const { push } = useRouter()

  const path = usePathname()
  const portal = path.split('/')[1]

  return (
    <S.Container {...rest}>
      <S.Header>
        <S.Title>{title}</S.Title>
        {href && (
          <IconButton
            onClick={() => push(`/${portal}/${href}`)}
            sx={{ marginLeft: '0.5rem' }}
          >
            <Launch color="primary" fontSize="small" />
          </IconButton>
        )}
      </S.Header>
      <S.Description>{description}</S.Description>
    </S.Container>
  )
}
