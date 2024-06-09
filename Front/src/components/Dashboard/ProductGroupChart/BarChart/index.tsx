import { useEffect, useRef, useState } from 'react'
import { useToast } from '@/hooks/useToast'
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  Colors,
  BarElement,
} from 'chart.js'
import { Bar, getElementsAtEvent } from 'react-chartjs-2'
import { TotalDTO } from '@/dtos/Dashboard'
import { dashboardService } from '@/services/dashboardService'
import { useDashboard } from '@/hooks/useDashboard'
import { useGraph } from '@/hooks/useGraph'
import { BACKGROUND_COLOR, BORDER_COLOR } from '@/constants/dashboardColors'
import { ProductGroupDTO } from '@/dtos/ProductGroup'
import _ from 'lodash'
import { ProductDTO } from '@/dtos/Product'

ChartJS.register(BarElement, Tooltip, Legend, Colors)

interface PieChartProps {
  productGroups: ProductGroupDTO[]
  productGroup?: ProductGroupDTO
  products?: ProductDTO[]
  handleGroup: (group: ProductGroupDTO | undefined) => void
}

interface TotalProductGroup extends TotalDTO {
  productGroup?: ProductGroupDTO
  product?: ProductDTO
}

export function BarChart({
  productGroups,
  handleGroup,
  productGroup,
  products = [],
}: PieChartProps) {
  const [totalByPeriod, setTotalByPeriod] = useState<TotalProductGroup[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { filters } = useDashboard()
  const { field } = useGraph()
  const toast = useToast()

  const isDetailed = products.length > 0

  async function fetchTotal() {
    try {
      setIsLoading(true)
      const totals: TotalProductGroup[] = []
      for (const productGroup of productGroups) {
        const data = await dashboardService.getTotal({
          ...filters,
          productGroupId: productGroup.id,
        })
        if (data) {
          totals.push({
            ...data,
            productGroup,
          })
        }
      }
      setTotalByPeriod(_.orderBy(totals, field, 'desc'))
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchTotalSub() {
    try {
      setIsLoading(true)
      const totals: TotalProductGroup[] = []
      for (const product of products) {
        const data = await dashboardService.getTotal({
          ...filters,
          productId: product.id,
        })
        if (data) {
          totals.push({
            ...data,
            productGroup,
            product,
          })
        }
      }
      setTotalByPeriod(_.orderBy(totals, field, 'desc'))
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  const hasRender = productGroups.length > 0

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        align: 'end',
        backgroundColor: '#fff',
        formatter(value) {
          if (field !== 'soldQuantity') {
            return new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(value)
          }
          return value
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItems) {
            return `${
              field === 'soldQuantity'
                ? tooltipItems.formattedValue
                : new Intl.NumberFormat('pt-Br', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(Number(tooltipItems.raw))
            }`
          },
        },
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
  }

  const data: ChartData<'bar'> = {
    labels: totalByPeriod.map((item) =>
      isDetailed ? item.product?.name : item.productGroup?.name,
    ),
    datasets: [
      {
        data: totalByPeriod.map((item) => item[field]),
        backgroundColor: BACKGROUND_COLOR,
        borderColor: BORDER_COLOR,
      },
    ],
  }

  const chartRef = useRef()

  useEffect(() => {
    setTotalByPeriod([])
    if (hasRender) {
      if (isDetailed) {
        fetchTotalSub()
      } else {
        fetchTotal()
      }
    }
  }, [filters, hasRender, isDetailed])

  const totals = isDetailed
    ? products.length === totalByPeriod.length
    : productGroups.length === totalByPeriod.length

  useEffect(() => {
    if (!totals) {
      isDetailed ? fetchTotalSub() : fetchTotal()
    }
  }, [totals])

  if (isLoading) {
    return <p>Carregando...</p>
  }

  return (
    <Bar
      data={data}
      options={options}
      onClick={(e) => {
        if (chartRef.current && !isDetailed) {
          const [graph] = getElementsAtEvent(chartRef.current, e)
          if (typeof graph?.index === 'number') {
            handleGroup(totalByPeriod[graph.index].productGroup)
          }
        }
      }}
      ref={chartRef}
    />
  )
}
