import { useEffect, useState } from 'react'
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
import { Bar } from 'react-chartjs-2'
import { TotalDTO } from '@/dtos/Dashboard'
import { dashboardService } from '@/services/dashboardService'
import { useDashboard } from '@/hooks/useDashboard'
import { Accredited } from '@/services/accreditedService'
import { useGraph } from '@/hooks/useGraph'
import _ from 'lodash'
import { BACKGROUND_COLOR, BORDER_COLOR } from '@/constants/dashboardColors'

ChartJS.register(BarElement, Tooltip, Legend, Colors)

interface PieChartProps {
  accrediteds: Accredited[]
}

interface TotalAccredited extends TotalDTO {
  accredited: Accredited
}

export function BarChart({ accrediteds }: PieChartProps) {
  const [totalByPeriod, setTotalByPeriod] = useState<TotalAccredited[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { filters } = useDashboard()
  const { field } = useGraph()
  const toast = useToast()

  async function fetchTotal() {
    try {
      setIsLoading(true)
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
      setTotalByPeriod(totals)
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const hasRender = accrediteds.length > 0

  useEffect(() => {
    if (hasRender) {
      fetchTotal()
    }
  }, [filters, hasRender])

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
    labels: _.orderBy(totalByPeriod, field, 'desc').map(
      (item) => item.accredited?.accreditedCompany?.name,
    ),
    datasets: [
      {
        data: _.orderBy(totalByPeriod, field, 'desc').map(
          (item) => item[field],
        ),
        backgroundColor: BACKGROUND_COLOR,
        borderColor: BORDER_COLOR,
      },
    ],
  }

  if (isLoading) {
    return <p>Carregando...</p>
  }

  return <Bar data={data} options={options} />
}
