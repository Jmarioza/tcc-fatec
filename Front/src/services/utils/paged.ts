import { Pagination } from '@/dtos/defaults'
import { AxiosResponse } from 'axios'
import { api } from '@/http/api'

type SortDirection = 'asc' | 'desc'

export type Sorted<T> = {
  field: keyof T
  direction?: SortDirection
}

interface Props<T> {
  baseUrl: string
  currentPage?: number
  size?: number
  params?: Record<string, string | number>
  sortedBy?: Sorted<T>[]
}

export async function getPaged<T>({
  baseUrl,
  currentPage = 0,
  params,
  size = 50,
  sortedBy,
}: Props<T>) {
  const sort = sortedBy
    ? sortedBy
        .map(({ field, direction }) => `${String(field)},${direction || 'asc'}`)
        .join('&sort=')
    : undefined

  const { data }: AxiosResponse<Pagination<T>> = await api.get(baseUrl, {
    params: {
      ...params,
      page: currentPage,
      size: String(size),
      sort,
    },
  })
  return {
    ...data,
  }
}
