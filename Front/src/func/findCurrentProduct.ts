import { ValueDTO } from '@/dtos/Value'

export function findCurrentProduct(values: ValueDTO[]): ValueDTO | null {
  if (!values || values.length === 0) {
    return null
  }
  values.sort(
    (a, b) =>
      new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime(),
  )
  const currentDate = new Date()
  for (const value of values) {
    const effectiveDate = new Date(value.effectiveDate)
    if (effectiveDate <= currentDate) {
      return value
    }
  }
  return null
}
