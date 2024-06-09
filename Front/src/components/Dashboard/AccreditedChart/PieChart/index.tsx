import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/useToast'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { TotalDTO } from '@/dtos/Dashboard'
import { dashboardService } from '@/services/dashboardService'
import { useDashboard } from '@/hooks/useDashboard'
import { DASHBOARD_FIELD } from '@/constants/dashboardField'
import { Accredited } from '@/services/accreditedService'
import { useGraph } from '@/hooks/useGraph'
import { BACKGROUND_COLOR, BORDER_COLOR } from '@/constants/dashboardColors'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import _ from 'lodash'

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

interface PieChartProps {
  accrediteds: Accredited[]
}

interface TotalAccredited extends TotalDTO {
  accredited: Accredited
}

export function PieChart({ accrediteds }: PieChartProps) {
  const [totalByPeriod, setTotalByPeriod] = useState<TotalAccredited[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { filters } = useDashboard()
  const { field } = useGraph()
  const toast = useToast()

  async function fetchTotal() {
    try {
      setIsLoading(true)
      setTotalByPeriod([])
      const totals: TotalAccredited[] = []
      for (const accredited of accrediteds) {
        const data = await dashboardService.getTotal({
          ...filters,
          accreditedId: accredited.id,
        })
        if (data) {
          totals.push({
            ...data,
            accredited,
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

  const hasRender = accrediteds.length > 0

  useEffect(() => {
    if (hasRender) fetchTotal()
  }, [hasRender, filters])

  const label = `Credenciado: ${DASHBOARD_FIELD.find(
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
          const accreditedName =
            totalByPeriod[context.dataIndex].accredited.accreditedCompany?.name

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

          return `${accreditedName} \n ${value} - ${percentual}`
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
        align: 'start',
        position: 'bottom',
      },
      title: {
        display: false,
      },
    },
  }

  const data: ChartData<'doughnut'> = {
    labels: totalByPeriod.map(
      (item) => item.accredited.accreditedCompany?.name,
    ),
    datasets: [
      {
        label,
        data: totalByPeriod.map((item) => item[field]),
        backgroundColor: BACKGROUND_COLOR,
        borderColor: BORDER_COLOR,
      },
    ],
  }

  if (isLoading) {
    return <p>Carregando...</p>
  }

  return (
    <Doughnut data={data} options={options} height={'300%'} width={'300%'} />
  )
}
