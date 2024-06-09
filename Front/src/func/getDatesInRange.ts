import { parseISO, addDays, isAfter } from 'date-fns'

export function getDatesInRange(startDate: string, endDate: string) {
  const datesInRange = []
  let currentDate = parseISO(startDate)

  while (isAfter(currentDate, parseISO(endDate)) === false) {
    datesInRange.push(new Date(currentDate))
    currentDate = addDays(currentDate, 1)
  }

  return datesInRange
}
