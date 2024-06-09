import axios from 'axios'
import { parseCookies } from 'nookies'
import { differenceInMinutes } from 'date-fns'

export const api = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_PROD_URL
      : process.env.NEXT_PUBLIC_API_DEV_URL,
  headers: {
    'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
  },
})

const sessionTime = Number(process.env.NEXT_PUBLIC_SESSION_TIME)

api.interceptors.request.use(
  function (config) {
    const isAuthRoute = !!config.headers.Authorization
    if (isAuthRoute) {
      const lastRequest = window.sessionStorage.getItem('lastRequest')
      if (lastRequest) {
        const lastRequestDate = new Date(Number(lastRequest))
        const difference = differenceInMinutes(new Date(), lastRequestDate)
        if (difference > sessionTime) {
          window.sessionStorage.removeItem('lastRequest')
          config.headers.Authorization = ''
          return config
        }
        window.sessionStorage.setItem(
          'lastRequest',
          String(new Date().getTime()),
        )
        return config
      }
      config.headers.Authorization = ''
      window.sessionStorage.setItem('lastRequest', String(new Date().getTime()))
      return config
    }

    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

const cookies = parseCookies()
if (cookies.JWT) {
  api.defaults.headers.common.Authorization = cookies.JWT
}
