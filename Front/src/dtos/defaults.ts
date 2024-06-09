export type STATUS = 'ENABLED' | 'DISABLED'

export interface CreatedDTO {
  code: number
  id: number
  uuid: string
}

export interface Pagination<T> {
  currentPage: number
  totalPages: number
  totalElements: number
  lastPage: false
  content: T
}

export type ResponseDefault = {
  code: number
  message: string
}
