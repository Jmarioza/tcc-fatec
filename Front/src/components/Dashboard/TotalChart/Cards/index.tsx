import { CardTotal } from '@/components/CardTotal'
import { GridBox } from '@/components/GridBox'
import { TotalDTO } from '@/dtos/Dashboard'
import { useDashboard } from '@/hooks/useDashboard'
import { useToast } from '@/hooks/useToast'
import { dashboardService } from '@/services/dashboardService'
import {
  CategoryOutlined,
  PaidOutlined,
  PointOfSaleOutlined,
  ShoppingCartOutlined,
} from '@mui/icons-material'
import { useEffect, useState } from 'react'

export function Cards() {
  const [total, setTotal] = useState<TotalDTO>()
  const { filters } = useDashboard()

  const toast = useToast()

  async function fetchTotals() {
    try {
      const data = await dashboardService.getTotal(filters)
      if (data) setTotal(data)
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  useEffect(() => {
    if (filters) {
      fetchTotals()
    }
  }, [filters])

  return (
    <GridBox column={4}>
      <CardTotal
        title="Total de Produto"
        amount={total?.totalValue}
        Icon={<ShoppingCartOutlined />}
      />
      <CardTotal
        title="Participação do Beneficiário"
        amount={total?.totalPaid}
        Icon={<PointOfSaleOutlined />}
      />
      <CardTotal
        title="Diferença"
        amount={total?.difference}
        Icon={<PaidOutlined />}
      />
      <CardTotal
        title="Quantidade"
        quantity={total?.soldQuantity}
        Icon={<CategoryOutlined />}
      />
    </GridBox>
  )
}
