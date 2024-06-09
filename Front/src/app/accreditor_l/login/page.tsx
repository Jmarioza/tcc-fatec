'use client'
import { LoginForm } from './components/LoginForm'
import { useAuth } from '@/hooks/useAuth'
import { AuthenticateProps, authService } from '@/services/authService'
import { userRolesService } from '@/services/userRolesService'
import { useRouter } from 'next/navigation'
import LinkUI from '@mui/material/Link'
import { AuthContainer } from '@/components/AuthContainer'
import { Footer } from '@/components/Footer'

export default function HorizontalLinearStepper() {
  const { signIn } = useAuth()
  const { push } = useRouter()

  async function authenticate(user: AuthenticateProps) {
    try {
      const token = await signIn(user, 'LIMITED_ACCREDITOR')
      if (token) {
        const { user_id: userId } = token
        const userRoles = await userRolesService.getByUserId(userId)
        if (userRoles) {
          const [role] = userRoles.filter(
            (item) => item.id.typeUser === 'LIMITED_ACCREDITOR',
          )
          authService.setUserAuth({
            companyId: role.id.companyId,
            typeUser: 'LIMITED_ACCREDITOR',
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
    <AuthContainer title="Painel de Controle - Credenciador">
      <LoginForm authenticate={authenticate} />
      <Footer>
        <LinkUI variant="body2" href="/forgot_password">
          Esqueceu a senha?
        </LinkUI>
      </Footer>
    </AuthContainer>
  )
}
