import { TotalPerDayDTO } from '@/dtos/Dashboard'

export function calculate(
  totalPerDay: TotalPerDayDTO[],
  datesInRange: Date[],
): TotalPerDayDTO[] {
  return datesInRange.map((item) => {
    const hasTotal = totalPerDay.find(
      (total) => total.date === item.toISOString().split('T')[0],
    )
    if (hasTotal) return hasTotal
    return {
      date: item.toLocaleDateString(),
      difference: 0,
      soldQuantity: 0,
      totalCommission: 0,
      totalPaid: 0,
      totalValue: 0,
    }
  })
}

export function calculateAccumulated(
  totalPerDay: TotalPerDayDTO[],
  datesInRange: Date[],
): TotalPerDayDTO[] {
  const accumulated: TotalPerDayDTO = {
    difference: 0,
    soldQuantity: 0,
    totalCommission: 0,
    totalPaid: 0,
    totalValue: 0,
  } as TotalPerDayDTO

  return datesInRange.map((item) => {
    const hasTotal = totalPerDay.find(
      (total) => total.date === item.toISOString().split('T')[0],
    )

    if (hasTotal) {
      accumulated.difference += hasTotal.difference
      accumulated.soldQuantity += hasTotal.soldQuantity
      accumulated.totalCommission += hasTotal.totalCommission
      accumulated.totalPaid += hasTotal.totalPaid
      accumulated.totalValue += hasTotal.totalValue
    }
    return { ...accumulated, date: item.toLocaleDateString() }
  })
}
