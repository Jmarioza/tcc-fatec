import { AxiosError } from 'axios'
import { authService } from '../authService'

export function handleError(
  error: unknown,
  operation: string,
  entityName: string,
) {
  if (error instanceof AxiosError) {
    if (error.request.status === 401) {
      authService.deAuth()
      return
    }
    if (error.response?.data.message) {
      throw new Error(error.response?.data.message)
    }
    if (error.response?.status) {
      switch (error.response.status) {
        case 404:
          throw new Error(
            `Não foi possível ${operation} o(a) ${entityName}. Rota não encontrada.`,
          )

        case 400:
          throw new Error(
            `Os dados informados para ${operation} o(a) ${entityName} são inválidos. Verifique se todos os campos estão preenchidos corretamente.`,
          )
        default:
          throw new Error(
            `Ocorreu um erro ao ${operation} o(a) ${entityName}. Por favor, tente novamente mais tarde.`,
          )
      }
    }
    throw new Error(
      `Ocorreu uma falha ao ${operation} o(a) ${entityName}. Por favor, tente novamente mais tarde.`,
    )
  } else {
    throw new Error(`Erro desconhecido ao ${operation} o(a) ${entityName}.`)
  }
}
