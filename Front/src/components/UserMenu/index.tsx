import { useState, useEffect } from 'react'
import {
  Menu,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuList,
  MenuItem,
  Avatar,
} from '@mui/material'
import { Logout, Person, Settings } from '@mui/icons-material'
import * as S from './styles'
import { UserDTO } from '@/dtos/User'
import { authService } from '@/services/authService'
import { userService } from '@/services/userService'
import { useAuth } from '@/hooks/useAuth'
import { usePathname, useRouter } from 'next/navigation'

export function UserMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [user, setUser] = useState<UserDTO>({} as UserDTO)

  const isOpen = !!anchorEl

  const { signOut } = useAuth()
  const pathName = usePathname()
  const { push } = useRouter()

  function goToUserSettings() {
    const rootPainel = pathName.split('/')[1]
    push(`/${rootPainel}/me`)
  }

  const formatName = () => {
    if (!user.name) {
      return ''
    }
    const nameSpited = user.name.split(' ')
    if (nameSpited.length > 1) {
      return `${nameSpited[0]} ${nameSpited[nameSpited.length - 1]}`
    }
    return nameSpited[0]
  }

  useEffect(() => {
    ;(async function () {
      const { userId } = authService.getUserAuth()
      const data = await userService.getById(userId)
      if (data) {
        setUser(data)
      }
    })()
  }, [])

  return (
    <div>
      <S.UserContainer
        aria-controls={isOpen ? 'basic-menu' : undefined}
        aria-expanded={isOpen ? 'true' : undefined}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <S.UserContent>
          <S.Username>{formatName()}</S.Username>
        </S.UserContent>
        <Avatar>
          <Person />
        </Avatar>
      </S.UserContainer>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        onClose={() => setAnchorEl(null)}
      >
        <MenuList>
          <MenuItem onClick={goToUserSettings}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            <ListItemText>Configurações</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={signOut}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sair</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  )
}
