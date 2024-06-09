import { formatISO, subWeeks } from 'date-fns'

const now = new Date()

export const TODAY = formatISO(new Date(), { representation: 'date' })
export const ONE_WEEK_AGO = formatISO(subWeeks(now, 1), {
  representation: 'date',
})
