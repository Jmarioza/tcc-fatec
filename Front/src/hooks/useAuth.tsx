import { useRouter, usePathname } from 'next/navigation'
import { AuthenticateProps, authService } from '@/services/authService'
import { TypeUser } from '@/dtos/UserRoles'
import { userRolesService } from '@/services/userRolesService'
import { destroyCookie } from 'nookies'

export function useAuth() {
  const { push } = useRouter()

  const pathName = usePathname()

  async function signIn(data: AuthenticateProps, typeUser: TypeUser) {
    try {
      const token = await authService.authenticate(data)
      if (token?.user_id) {
        const userData = await userRolesService.getByUserId(token.user_id)
        const hasPermission = userData?.filter(
          (item) => item.id.typeUser === typeUser,
        ).length
        if (!hasPermission) {
          throw new Error('Tipo de acesso inválido.')
        }
      }
      return token
    } catch (error) {
      throw new Error('Usuário e/ou inválido(s).')
    }
  }

  function eraseCookie(name: string) {
    document.cookie = name + '=; Max-Age=0'
  }

  function signOut() {
    destroyCookie(null, 'ID')
    destroyCookie(null, 'JWT')
    eraseCookie('ID')
    eraseCookie('JWT')
    const rootPainel = pathName.split('/')[1]
    push(`/${rootPainel}/login`)
  }

  return {
    signIn,
    signOut,
  }
}
