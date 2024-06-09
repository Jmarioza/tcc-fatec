import { api } from '@/http/api'
import { handleError } from './errors/errorHandler'
import { GroupedTotal, TotalDTO, TotalPerDayDTO } from '@/dtos/Dashboard'

export interface FilterDashboard {
  accreditorId: number
  dateStart: string
  dateEnd: string
  accreditedId?: number | number[]
  productGroupId?: number
  productId?: number
  beneficiaryGroupId?: number | number[]
  beneficiarySubgroupId?: number
  status?: 'OK' | 'CANCELED'
}

async function getTotal(params: FilterDashboard) {
  try {
    let accreditedSearch = null
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

    const { data } = await api.get<TotalDTO>('/transactions/totals', {
      params: {
        ...params,
        accreditedId: accreditedSearch,
        beneficiaryGroupId: beneficiaryGroupSearch,
      },
    })
    return data
  } catch (error) {
    handleError(error, 'calcular', 'transações')
  }
}

async function getTotalPerDay(params: FilterDashboard) {
  try {
    let accreditedSearch = null
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

    const { data } = await api.get<TotalPerDayDTO[]>(
      '/transactions/date_totals',
      {
        params: {
          ...params,
          accreditedId: accreditedSearch,
          beneficiaryGroupId: beneficiaryGroupSearch,
        },
      },
    )
    return data
  } catch (error) {
    handleError(error, 'calcular', 'transações')
  }
}

async function getGroupedTotal(params: FilterDashboard) {
  try {
    const { data } = await api.get<GroupedTotal[]>('/transactions/grouped', {
      params,
    })
    return data
  } catch (error) {
    handleError(error, 'calcular', 'transações')
  }
}

export const dashboardService = {
  getTotal,
  getTotalPerDay,
  getGroupedTotal,
}
