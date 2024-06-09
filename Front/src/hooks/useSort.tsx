import { useState } from 'react'

type SortDirection = 'asc' | 'desc'

export type Sorted<T> = {
  field: keyof T
  direction?: SortDirection
}

export function useSort<T>() {
  const [sorted, setSorted] = useState<Sorted<T>[]>([])

  function handleSort(fieldName: keyof T) {
    const isFieldSorted = sorted.some((item) => item.field === fieldName)

    if (isFieldSorted) {
      const updatedSort: Sorted<T>[] = sorted.map((item) =>
        item.field === fieldName
          ? {
              ...item,
              direction: item.direction === 'asc' ? 'desc' : 'asc',
            }
          : item,
      )
      setSorted(updatedSort)
    } else {
      setSorted([{ field: fieldName, direction: 'asc' }, ...sorted])
    }
  }

  return {
    sorted,
    handleSort,
  }
}
