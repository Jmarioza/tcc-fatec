/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(request: NextRequest) {
  const fromTo = [
    {
      from: 'ACCREDITOR',
      to: 'ACCREDITOR',
    },
    {
      from: 'ACCREDITOR_L',
      to: 'LIMITED_ACCREDITOR',
    },
    {
      from: 'ACCREDITED_M',
      to: 'MASTER_ACCREDITED',
    },
    {
      from: 'ACCREDITED',
      to: 'ACCREDITED',
    },
    {
      from: 'SYSTEM',
      to: 'SYSTEM',
    },
  ]

  const {
    cookies,
    nextUrl: { protocol, host, pathname },
  } = request

  function deleteCookies() {
    cookies.delete('ID')
    cookies.delete('JWT')
    response.cookies.delete('JWT')
    response.cookies.delete('ID')
  }

  const response = NextResponse.next()

  const routeArray = pathname.split('/')
  const typePanel = routeArray[1].toUpperCase()
  const route = routeArray[routeArray.length - 1]

  const isPublicRoute = route === 'login'

  const loginURL = new URL(
    `${typePanel.toLowerCase()}/login`,
    `${protocol}${host}`,
  )

  const homeURL = new URL(
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_WEB_PROD_URL!
      : process.env.NEXT_PUBLIC_WEB_DEV_URL!,
  )

  if (!cookies.has('ID') || !cookies.has('JWT')) {
    deleteCookies()
  }
  const user =
    cookies.has('ID') && cookies.has('JWT')
      ? JSON.parse(atob(String(cookies.get('ID')?.value)))
      : undefined

  if (isPublicRoute) {
    deleteCookies()
  }

  if (!isPublicRoute && !user) {
    deleteCookies()
    const res = NextResponse.redirect(loginURL)
    res.cookies.delete('ID')
    res.cookies.delete('JWT')
    return res
  }

  if (
    user &&
    !isPublicRoute &&
    user.typeUser !== fromTo.find((i) => i.from === typePanel)?.to
  ) {
    deleteCookies()
    const res = NextResponse.redirect(homeURL)
    res.cookies.delete('ID')
    res.cookies.delete('JWT')
    return res
  }
  return response
}

export const config = {
  matcher: [
    '/accredited/:path*',
    '/accredited_m/:path*',
    '/accreditor/:path*',
    '/accreditor_l/:path*',
    '/system/:path*',
  ],
}
