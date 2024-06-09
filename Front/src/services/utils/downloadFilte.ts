import { api } from '@/http/api'
import { handleError } from '../errors/errorHandler'

export async function downloadFile(
  url: string,
  filename: string,
  params?: object,
) {
  try {
    const { data } = await api.get(url, {
      responseType: 'blob',
      params,
    })
    if (data) {
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(url)
    }
  } catch (error) {
    handleError(error, 'baixar', 'relatorio')
  }
}
