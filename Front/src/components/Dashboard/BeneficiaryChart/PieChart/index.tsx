import { useEffect, useState, useRef } from 'react'
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
import { BeneficiaryGroupDTO } from '@/dtos/BeneficiaryGroup'
import { BeneficiarySubGroupDTO } from '@/dtos/BeneficiarySubGroup'
import _ from 'lodash'

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

interface PieChartProps {
  beneficiaryGroups: BeneficiaryGroupDTO[]
  beneficiarySubGroups?: BeneficiarySubGroupDTO[]
  beneficiaryGroup?: BeneficiaryGroupDTO
  handleGroup: (group: BeneficiaryGroupDTO | undefined) => void
}

interface Total extends TotalDTO {
  beneficiaryGroup?: BeneficiaryGroupDTO
  beneficiarySubGroup?: BeneficiarySubGroupDTO
}

export function PieChart({
  beneficiaryGroups,
  handleGroup,
  beneficiaryGroup,
  beneficiarySubGroups = [],
}: PieChartProps) {
  const [totalByPeriod, setTotalByPeriod] = useState<Total[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { filters } = useDashboard()
  const { field } = useGraph()
  const toast = useToast()

  const isDetailed = beneficiarySubGroups.length > 0

  async function fetchTotal() {
    try {
      setIsLoading(true)
      setTotalByPeriod([])
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
  const totals = isDetailed
    ? beneficiarySubGroups.length === totalByPeriod.length
    : beneficiaryGroups.length === totalByPeriod.length

  useEffect(() => {
    if (hasRender) {
      isDetailed ? fetchTotalSub() : fetchTotal()
    }
  }, [hasRender, filters, isDetailed])

  useEffect(() => {
    if (!totals) {
      isDetailed ? fetchTotalSub() : fetchTotal()
    }
  }, [totals])

  const label = `${DASHBOARD_FIELD.find((view) => view.value === field)?.label}`

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        anchor: 'center',
        align: 'end',
        backgroundColor: '#FFF',
        borderRadius: 4,
        formatter(value, context) {
          const accreditedName = isDetailed
            ? totalByPeriod[context.dataIndex].beneficiarySubGroup?.name
            : totalByPeriod[context.dataIndex].beneficiaryGroup?.tag

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
      },
      title: {
        display: false,
      },
    },
  }

  const data: ChartData<'doughnut'> = {
    labels: isDetailed
      ? totalByPeriod.map((item) => item.beneficiarySubGroup?.name)
      : totalByPeriod.map((item) => item.beneficiaryGroup?.tag),
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
            handleGroup(totalByPeriod[graph.index].beneficiaryGroup)
          }
        }
      }}
      ref={chartRef}
    />
  )
}
