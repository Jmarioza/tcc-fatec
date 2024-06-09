import { TransactionOccurrenceDTO } from '@/dtos/TransactionOccurrence'
import { api } from '@/http/api'
import { handleError } from './errors/errorHandler'
import { fetchAllPages } from './utils/fetchAllPaged'

async function getAll() {
  try {
    const { data } = await api.get<TransactionOccurrenceDTO[]>(
      '/transaction_occurrences/all',
    )
    return data
  } catch (error) {
    handleError(error, 'listar', 'serviços')
  }
}

async function getById(id: number) {
  try {
    const { data } = await api.get<TransactionOccurrenceDTO>(
      `/transaction_occurrences/${id}`,
    )
    return data
  } catch (error) {
    handleError(error, 'encontrar', 'serviços')
  }
}

async function getByTransactionId(transactionId: number) {
  try {
    const values = await fetchAllPages<TransactionOccurrenceDTO>(
      api,
      `/transaction_occurrences/transactions`,
      {
        transactionId,
      },
    )
    return values
  } catch (error) {
    handleError(error, 'encontrar', 'log')
  }
}

export const transactionOccurrenceService = {
  getById,
  getAll,
  getByTransactionId,
}
