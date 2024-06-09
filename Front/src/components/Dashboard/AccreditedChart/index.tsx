import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/useToast'
import { GridBox } from '@/components/GridBox'
import { PieChart } from './PieChart'
import { useDashboard } from '@/hooks/useDashboard'
import { Accredited, accreditedService } from '@/services/accreditedService'
import { authService } from '@/services/authService'
import { GraphProvider } from '@/contexts/GraphContext'
import { BarChart } from './BarChart'
import * as S from '../styles'

export function AccreditedChart() {
  const [accrediteds, setAccrediteds] = useState<Accredited[]>([])
  const { filters } = useDashboard()
  const toast = useToast()

  useEffect(() => {
    if (filters.accreditorId) {
      ;(async function () {
        try {
          const { userId, typeUser } = authService.getUserAuth()
          if (typeUser === 'ACCREDITED' || typeUser === 'MASTER_ACCREDITED') {
            const data = await accreditedService.getByUserAndAccreditor(
              userId,
              filters.accreditorId,
            )
            setAccrediteds(data || [])
          } else {
            const data = await accreditedService.getByAccreditor(
              filters.accreditorId,
            )
            setAccrediteds(
              data?.filter((item) => item.status === 'ENABLED') || [],
            )
          }
        } catch (error) {
          if (error instanceof Error) toast.error(error.message)
        }
      })()
    }
  }, [filters])

  return (
    <GraphProvider title="Credenciado" hasView={false}>
      <GridBox column={5}>
        <S.Content
          style={{
            gridColumn: 'span 2',
          }}
        >
          <PieChart accrediteds={accrediteds} />
        </S.Content>
        <S.Content
          style={{
            gridColumn: 'span 3',
          }}
        >
          <BarChart accrediteds={accrediteds} />
        </S.Content>
      </GridBox>
    </GraphProvider>
  )
}
