'use client'
import { LoginForm } from './components/LoginForm'
import { useAuth } from '@/hooks/useAuth'
import { AuthenticateProps, authService } from '@/services/authService'
import { userRolesService } from '@/services/userRolesService'
import { useRouter } from 'next/navigation'
import { AuthContainer } from '@/components/AuthContainer'
import { Footer } from '@/components/Footer'
import LinkUI from '@mui/material/Link'

export default function HorizontalLinearStepper() {
  const { signIn } = useAuth()
  const { push } = useRouter()

  async function authenticate(user: AuthenticateProps) {
    try {
      const token = await signIn(user, 'SYSTEM')
      if (token) {
        const { user_id: userId } = token
        const userRoles = await userRolesService.getByUserId(userId)
        if (userRoles) {
          const [role] = userRoles.filter(
            (item) => item.id.typeUser === 'SYSTEM',
          )
          authService.setUserAuth({
            companyId: role.id.companyId,
            typeUser: 'SYSTEM',
            userId,
          })
          push('./')
        }
      }
    } catch (error) {
      throw new Error('Usuário e/ou senha inválidos')
    }
  }

  return (
    <AuthContainer title="Painel de Controle - System">
      <LoginForm authenticate={authenticate} />
      <Footer>
        <LinkUI variant="body2" href="/forgot_password">
          Esqueceu a senha?
        </LinkUI>
      </Footer>
    </AuthContainer>
  )
}
