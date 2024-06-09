import { useEffect, useState } from 'react'
import { UserDTO } from '@/dtos/User'
import { useToast } from '@/hooks/useToast'
import { UserRoles, userRolesService } from '@/services/userRolesService'
import { userService } from '@/services/userService'
import { Box, Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/authService'

interface Props {
  userId: number
}

export function CompanyList({ userId }: Props) {
  const [userRoles, setUserRoles] = useState<UserRoles[]>([])
  const [user, setUser] = useState<UserDTO>({} as UserDTO)

  const { push } = useRouter()
  const toast = useToast()

  function goToHomeScreen(companyId: number) {
    authService.setUserAuth({
      userId,
      companyId,
      typeUser: 'LIMITED_ACCREDITOR',
    })
    push('./')
  }

  useEffect(() => {
    ;(async function () {
      try {
        const [rolesData, userData] = await Promise.all([
          userRolesService.getByUserId(userId),
          userService.getById(userId),
        ])
        if (rolesData && userData) {
          setUserRoles(
            rolesData.filter((item) => item.id.typeUser === 'ACCREDITED'),
          )
          setUser(userData)
        }
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    })()
  }, [])
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <h2>{`Bem-vindo, ${user.name}`}</h2>
      <p>Selecione a empresa desejada:</p>
      {userRoles.map((item, index) => (
        <Button
          key={index}
          variant="outlined"
          fullWidth
          onClick={() => goToHomeScreen(item.id.companyId)}
        >
          {item.company?.name}
        </Button>
      ))}
    </Box>
  )
}
