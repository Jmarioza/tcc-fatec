import { useEffect, useRef, useState } from 'react'
import { useToast } from '@/hooks/useToast'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js'
import { Doughnut, getElementsAtEvent } from 'react-chartjs-2'
import { TotalDTO } from '@/dtos/Dashboard'
import { dashboardService } from '@/services/dashboardService'
import { useDashboard } from '@/hooks/useDashboard'
import { DASHBOARD_FIELD } from '@/constants/dashboardField'
import { useGraph } from '@/hooks/useGraph'
import { BACKGROUND_COLOR, BORDER_COLOR } from '@/constants/dashboardColors'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import _ from 'lodash'
import { ProductGroupDTO } from '@/dtos/ProductGroup'
import { ProductDTO } from '@/dtos/Product'

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

interface PieChartProps {
  productGroups: ProductGroupDTO[]
  products?: ProductDTO[]
  productGroup?: ProductGroupDTO
  handleGroup: (group: ProductGroupDTO | undefined) => void
}

interface TotalProductGroup extends TotalDTO {
  productGroup?: ProductGroupDTO
  product?: ProductDTO
}

export function PieChart({
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
      setTotalByPeriod([])
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
      setTotalByPeriod([])
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

  useEffect(() => {
    if (hasRender) {
      isDetailed ? fetchTotalSub() : fetchTotal()
    }
  }, [hasRender, filters, isDetailed])

  const totals = isDetailed
    ? products.length === totalByPeriod.length
    : productGroups.length === totalByPeriod.length

  useEffect(() => {
    if (!totals) {
      isDetailed ? fetchTotalSub() : fetchTotal()
    }
  }, [totals])

  const label = `Grupo de Produto: ${DASHBOARD_FIELD.find(
    (view) => view.value === field,
  )?.label}`

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        anchor: 'center',
        align: 'end',
        backgroundColor: '#fff',
        borderRadius: 8,
        formatter(value, context) {
          const name = isDetailed
            ? totalByPeriod[context.dataIndex].product?.name
            : totalByPeriod[context.dataIndex].productGroup?.name

          const total = _.sumBy(totalByPeriod, field)
          let percentual = ''
          if (isFinite(value / total)) {
            percentual = new Intl.NumberFormat('pt-BR', {
              style: 'percent',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(value / total)
          }

          if (field !== 'soldQuantity') {
            value = new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(value)
          }

          return `${name} \n ${value} - ${percentual}`
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItems) {
            return `${tooltipItems.dataset.label} ${
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

  const data: ChartData<'doughnut'> = {
    labels: isDetailed
      ? totalByPeriod.map((item) => item.product?.name)
      : totalByPeriod.map((item) => item.productGroup?.name),
    datasets: [
      {
        label,
        data: totalByPeriod.map((item) => item[field]),
        backgroundColor: BACKGROUND_COLOR,
        borderColor: BORDER_COLOR,
      },
    ],
  }

  const chartRef = useRef()

  if (isLoading) {
    return <p>Carregando...</p>
  }

  return (
    <Doughnut
      data={data}
      options={options}
      height={'300%'}
      width={'300%'}
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
