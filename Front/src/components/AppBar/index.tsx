import { IconButton, Toolbar, Typography } from '@mui/material'
import { Menu } from '@mui/icons-material'
import * as S from './styles'
import { UserMenu } from '../UserMenu'

interface Props {
  title: string
  open: boolean
  toggleOpen: () => void
  signOut: () => void
}

export function AppBar(props: Props) {
  return (
    <S.Container position="absolute" open={props.open}>
      <Toolbar
        sx={{
          pr: '24px',
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={props.toggleOpen}
          sx={{
            marginRight: '36px',
            ...(props.open && { display: 'none' }),
          }}
        >
          <Menu />
        </IconButton>

        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          {props.title}
        </Typography>

        <UserMenu />
      </Toolbar>
    </S.Container>
  )
}
