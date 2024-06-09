import { api } from '@/http/api'
import { fetchAllPages } from './utils/fetchAllPaged'
import { TransactionDTO } from '@/dtos/Transaction'
import { handleError } from './errors/errorHandler'

type ChangeStatusDTO = {
  status: 'OK' | 'CANCELED'
  reason: string
  transactionId: number
}

interface Search {
  accreditorId?: number
  productId?: number
  productGroupId?: number
  cpfBeneficiary?: string
  localTransactionReference?: string
  dateStart: string
  dateEnd: string

  beneficiarySubgroupId?: number
  statusTransaction?: 'OK' | 'CANCELED'
}

export interface SearchForm extends Search {
  accreditedId?: number
  beneficiaryGroupId?: number
}

export interface SearchParams extends Search {
  accreditedId?: number | number[]
  beneficiaryGroupId?: number | number[]
}

async function get(params: SearchParams) {
  try {
    let accreditedSearch
    if (typeof params.accreditedId === 'object') {
      accreditedSearch = params.accreditedId.join(',')
    } else if (typeof params.accreditedId === 'number') {
      accreditedSearch = String(params.accreditedId)
    }

    let beneficiaryGroupSearch
    if (typeof params.beneficiaryGroupId === 'object') {
      beneficiaryGroupSearch = params.beneficiaryGroupId.join(',')
    } else if (typeof params.beneficiaryGroupId === 'number') {
      beneficiaryGroupSearch = String(params.beneficiaryGroupId)
    }

    const res = await fetchAllPages<TransactionDTO>(
      api,
      'transactions/filters',
      {
        ...params,
        accreditedId: accreditedSearch,
        beneficiaryGroupId: beneficiaryGroupSearch,
      },
    )
    return res
  } catch (error) {
    handleError(error, 'listar', 'transações')
  }
}

async function getById(id: number) {
  try {
    const { data } = await api.get<TransactionDTO>(`/transactions/${id}`)
    return data
  } catch (error) {
    handleError(error, 'encontrar', 'transação')
  }
}

async function changeStatus({
  reason,
  transactionId,
  status,
}: ChangeStatusDTO) {
  try {
    await api.put('transactions/unesp/update_status', {
      idTransaction: transactionId,
      statusTransaction: status,
      reason,
    })
  } catch (error) {
    handleError(error, status === 'OK' ? 'restaurar' : 'cancelar', 'transação')
  }
}

export const transactionsService = {
  get,
  getById,
  changeStatus,
}
