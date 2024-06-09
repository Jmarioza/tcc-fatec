/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NewPasswordDTO, TokenDTO } from '@/dtos/Auth'
import { api } from '@/http/api'
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { handleError } from './errors/errorHandler'
import { UserRole } from '@/dtos/UserRoles'
import { ResponseDefault } from '@/dtos/defaults'

export type AuthenticateProps = {
  email: string
  password: string
}

async function authenticate(user: AuthenticateProps) {
  try {
    window.sessionStorage.setItem('lastRequest', String(new Date().getTime()))
    const { data } = await api.post<TokenDTO>(
      '/authentication/token',
      undefined,
      {
        headers: {
          username: user.email,
          password: user.password,
        },
      },
    )
    const token = 'Bearer ' + data.access_token
    setCookie(undefined, 'JWT', token, {
      maxAge: 24 * 60 * 60,
      path: '/',
    })
    api.defaults.headers.common.Authorization = token

    return data
  } catch (error) {
    handleError(error, 'autenticar', 'usuário')
  }
}

function setUserAuth(userRole: UserRole) {
  const base64String = btoa(JSON.stringify(userRole))
  setCookie(undefined, 'ID', base64String, {
    maxAge: 24 * 60 * 60,
    path: '/',
  })
}

function deAuth() {
  destroyCookie(null, 'ID')
  destroyCookie(null, 'JWT')
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_WEB_PROD_URL!
      : process.env.NEXT_PUBLIC_WEB_DEV_URL!

  const painel = window.location.href.split('/')[3]
  window.location.href = `${baseUrl}/${painel}/login`
}
function getUserAuth() {
  try {
    const cookies = parseCookies()
    if (!cookies.ID) throw new Error('ID não encontrado')
    const userRole = JSON.parse(atob(cookies.ID)) as UserRole
    return userRole
  } catch (error) {
    deAuth()
    throw new Error('Falha ao buscar usuário autenticado.')
  }
}

async function requestTempPassword(username: string) {
  try {
    const { data } = await api.post<ResponseDefault>(
      '/users/reset-password-request',
      {},
      {
        headers: {
          username,
        },
      },
    )
    return data
  } catch (error) {
    handleError(error, 'requisitar', 'nova senha')
  }
}

export async function newPassword({
  newPassword,
  tempPassword,
  username,
}: NewPasswordDTO) {
  try {
    const { data } = await api.post<ResponseDefault>('/users/reset-password', {
      newPassword,
      tempPassword,
      username,
    })
    return data
  } catch (error) {
    handleError(error, 'atualizar', 'senha')
  }
}

export const authService = {
  newPassword,
  requestTempPassword,
  authenticate,
  getUserAuth,
  setUserAuth,
  deAuth,
}
