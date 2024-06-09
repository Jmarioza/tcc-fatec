import { Pagination } from '@/dtos/defaults'
import { AxiosInstance, AxiosResponse } from 'axios'

export async function fetchAllPages<T>(
  apiInstance: AxiosInstance,
  endpoint: string,
  params: object = {},
): Promise<T[]> {
  const content: T[] = []

  let page = 0
  let lastPage = false

  while (!lastPage) {
    const response: AxiosResponse<Pagination<T[]>> = await apiInstance.get(
      endpoint,
      {
        params: {
          ...params,
          page,
          pageSize: 100,
        },
      },
    )
    content.push(...response.data.content)
    lastPage = response.data.lastPage
    page++
  }

  return content
}
