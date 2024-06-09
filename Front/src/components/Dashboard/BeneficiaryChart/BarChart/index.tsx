import { useEffect, useState, useRef } from 'react'
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
import _ from 'lodash'
import { BACKGROUND_COLOR, BORDER_COLOR } from '@/constants/dashboardColors'
import { BeneficiaryGroupDTO } from '@/dtos/BeneficiaryGroup'
import { BeneficiarySubGroupDTO } from '@/dtos/BeneficiarySubGroup'

ChartJS.register(BarElement, Tooltip, Legend, Colors)

interface BarChartProps {
  beneficiaryGroups: BeneficiaryGroupDTO[]
  beneficiarySubGroups?: BeneficiarySubGroupDTO[]
  beneficiaryGroup?: BeneficiaryGroupDTO
  handleGroup: (group: BeneficiaryGroupDTO | undefined) => void
}

interface Total extends TotalDTO {
  beneficiaryGroup?: BeneficiaryGroupDTO
  beneficiarySubGroup?: BeneficiarySubGroupDTO
}

export function BarChart({
  beneficiaryGroups,
  handleGroup,
  beneficiaryGroup,
  beneficiarySubGroups = [],
}: BarChartProps) {
  const [totalByPeriod, setTotalByPeriod] = useState<Total[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { filters } = useDashboard()
  const { field } = useGraph()
  const toast = useToast()

  const isDetailed = beneficiarySubGroups.length > 0

  async function fetchTotal() {
    try {
      setIsLoading(true)
      const totals: Total[] = []
      for (const beneficiaryGroup of beneficiaryGroups) {
        const data = await dashboardService.getTotal({
          ...filters,
          beneficiaryGroupId: beneficiaryGroup.id,
        })
        if (data) {
          totals.push({
            ...data,
            beneficiaryGroup,
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
      const totals: Total[] = []
      for (const beneficiarySubGroup of beneficiarySubGroups) {
        const data = await dashboardService.getTotal({
          ...filters,
          beneficiarySubgroupId: beneficiarySubGroup.id,
        })
        if (data) {
          totals.push({
            ...data,
            beneficiaryGroup,
            beneficiarySubGroup,
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

  const hasRender = beneficiaryGroups.length > 0

  useEffect(() => {
    if (hasRender) {
      isDetailed ? fetchTotalSub() : fetchTotal()
    }
  }, [hasRender, filters, isDetailed])

  const totals = isDetailed
    ? beneficiarySubGroups.length === totalByPeriod.length
    : beneficiaryGroups.length === totalByPeriod.length

  useEffect(() => {
    if (!totals) {
      isDetailed ? fetchTotalSub() : fetchTotal()
    }
  }, [totals])

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
      isDetailed ? item.beneficiarySubGroup?.name : item.beneficiaryGroup?.name,
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
            handleGroup(totalByPeriod[graph.index].beneficiaryGroup)
          }
        }
      }}
      ref={chartRef}
    />
  )
}
