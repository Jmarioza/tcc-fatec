import _ from 'lodash'
import { endOfWeek, format, parseISO, startOfWeek } from 'date-fns'
import { TotalPerDayDTO, TotalDTO } from '@/dtos/Dashboard'
import { ptBR } from 'date-fns/locale'
export interface PerWeek {
  week: string
  total: TotalDTO
}

export interface PerMonth {
  month: string
  total: TotalDTO
}

function perWeek(data: TotalPerDayDTO[]) {
  const groupByWeek = _.groupBy(data, (item) =>
    format(startOfWeek(parseISO(item.date)), 'yyyy-MM-dd'),
  )

  const consolidate = _.mapValues(groupByWeek, (itens) => ({
    week: `${format(startOfWeek(parseISO(itens[0].date)), 'dd/MM')} - ${format(
      endOfWeek(parseISO(itens[0].date)),
      'dd/MM/yyyy',
    )}`,
    total: {
      totalValue: _.sumBy(itens, 'totalValue'),
      totalPaid: _.sumBy(itens, 'totalPaid'),
      difference: _.sumBy(itens, 'difference'),
      totalCommission: _.sumBy(itens, 'totalCommission'),
      soldQuantity: _.sumBy(itens, 'soldQuantity'),
    },
  }))

  return Object.values(consolidate) as PerWeek[]
}

function perMonth(data: TotalPerDayDTO[]) {
  const groupByMonth = _.groupBy(data, (item) =>
    format(parseISO(item.date), 'yyyy-MM'),
  )

  const consolidate = _.mapValues(groupByMonth, (itens) => ({
    month: format(parseISO(itens[0].date), 'MMM yyyy', {
      locale: ptBR,
    }),
    total: {
      totalValue: _.sumBy(itens, 'totalValue'),
      totalPaid: _.sumBy(itens, 'totalPaid'),
      difference: _.sumBy(itens, 'difference'),
      totalCommission: _.sumBy(itens, 'totalCommission'),
      soldQuantity: _.sumBy(itens, 'soldQuantity'),
    },
  }))

  return Object.values(consolidate) as PerMonth[]
}

export const consolidateTransaction = {
  perMonth,
  perWeek,
}
