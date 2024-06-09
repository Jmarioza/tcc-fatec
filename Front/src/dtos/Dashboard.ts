export type Field =
  | 'difference'
  | 'soldQuantity'
  | 'totalCommission'
  | 'totalPaid'
  | 'totalValue'

export type View = 'accumulated' | 'diary'

export type TypeValue = 'PERCENTAGE' | 'REAL'

export interface TotalDTO {
  totalValue: number
  totalPaid: number
  difference: number
  totalCommission: number
  soldQuantity: number
}

export interface TotalPerDayDTO extends TotalDTO {
  date: string
}

export interface GroupedTotal {
  date: string
  accredited: {
    id: number
    company: {
      id: number
      name: string
    }
  }
  productGroup: {
    id: number
    name: string
  }
  total: TotalDTO
}
