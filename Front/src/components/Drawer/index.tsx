import { Divider, IconButton, List, Toolbar } from '@mui/material'
import * as S from './styles'
import Image from 'next/image'
import Logo from '@/assets/logo.jpg'
import { ChevronLeft } from '@mui/icons-material'
import { ReactNode } from 'react'

interface Props {
  open: boolean
  children: ReactNode
  toggleOpen: () => void
}

export function Drawer(props: Props) {
  return (
    <S.Container variant="permanent" open={props.open}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: [1],
        }}
      >
        <Image src={Logo} width={160} height={48} alt="logo" />
        <IconButton onClick={props.toggleOpen}>
          <ChevronLeft />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">{props.children}</List>
    </S.Container>
  )
}
