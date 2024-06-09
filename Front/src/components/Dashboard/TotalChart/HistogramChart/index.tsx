'use client'
import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  Colors,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { dashboardService } from '@/services/dashboardService'
import { getDatesInRange } from '@/func/getDatesInRange'
import { useDashboard } from '@/hooks/useDashboard'
import { DASHBOARD_FIELD } from '@/constants/dashboardField'
import { useToast } from '@/hooks/useToast'
import { calculate, calculateAccumulated } from '@/func/dashboard'
import { Field, TotalPerDayDTO } from '@/dtos/Dashboard'

import { useGraph } from '@/hooks/useGraph'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
)

export function HistogramChart() {
  const [dataSet, setDataSet] = useState<TotalPerDayDTO[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const toast = useToast()
  const { view } = useGraph()
  const { filters } = useDashboard()
  const { dateStart, dateEnd } = filters

  const datesInRange = getDatesInRange(dateStart, dateEnd)

  async function arrayToDataset() {
    try {
      setIsLoading(true)
      const values = await dashboardService.getTotalPerDay({
        ...filters,
      })
      if (values) {
        setDataSet(
          view === 'accumulated'
            ? calculateAccumulated(values, datesInRange)
            : calculate(values, datesInRange),
        )
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (filters) {
      arrayToDataset()
    }
  }, [filters, view])

  const data: ChartData<'line'> = {
    labels: datesInRange.map((date) => date.toLocaleDateString('pt-BR')),
    datasets: DASHBOARD_FIELD.map((a) => {
      return {
        label: a.label,
        data: dataSet.map((i) => i[a.value as Field]),
      }
    }),
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      datalabels: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItems) {
            return `${tooltipItems.dataset.label} ${
              tooltipItems.dataset.label === 'Quantidade'
                ? tooltipItems.formattedValue
                : new Intl.NumberFormat('pt-Br', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(Number(tooltipItems.raw))
            }`
          },
        },
      },
      colors: {
        enabled: true,
        forceOverride: true,
      },
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
  }

  if (isLoading) {
    return <p>Carregando</p>
  }

  return <Line options={options} data={data} width={420} />
}
