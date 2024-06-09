import { Sorted, getPaged } from '@/services/utils/paged'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

interface UsePaginationProps<T> {
  initialPage?: number
  pageSize?: number
  params?: Record<string, string | number>
  sort?: Sorted<T>[]
}

export function usePagination<T>(
  path: string,
  { initialPage = 0, pageSize = 50, params, sort }: UsePaginationProps<T>,
) {
  const [currentPage, setCurrentPage] = useState<number>(initialPage)
  const [totalPages, setTotalPages] = useState<number>()
  const [totalElements, setTotalElements] = useState<number>()
  const [isLastPage, setIsLastPage] = useState<boolean>()

  async function fetchData() {
    const response = await getPaged<T>({
      baseUrl: path,
      params,
      currentPage,
      sortedBy: sort,
      size: pageSize,
    })
    setTotalElements(response.totalElements)
    setTotalPages(response.totalPages)
    setIsLastPage(response.lastPage)
    return response.content
  }

  const query = useQuery({
    queryKey: [path, currentPage, sort],
    queryFn: fetchData,
  })

  function nextPage() {
    setCurrentPage((page) => page + 1)
  }

  function previousPage() {
    setCurrentPage((page) => page - 1)
  }

  function goToPage(page: number) {
    setCurrentPage(page)
  }

  return {
    ...query,
    currentPage,
    nextPage,
    previousPage,
    goToPage,
    totalElements,
    totalPages,
    isLastPage,
  }
}
