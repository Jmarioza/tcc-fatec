import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/useToast'
import { GridBox } from '@/components/GridBox'
import { PieChart } from './PieChart'
import { useDashboard } from '@/hooks/useDashboard'
import { beneficiaryGroupService } from '@/services/beneficiaryGroupService'
import { BeneficiaryGroupDTO } from '@/dtos/BeneficiaryGroup'
import { GraphProvider } from '@/contexts/GraphContext'
import * as S from '../styles'
import { BarChart } from './BarChart'
import { BeneficiarySubGroupDTO } from '@/dtos/BeneficiarySubGroup'
import { beneficiarySubGroupService } from '@/services/beneficiarySubGroupService'
import { IconButton } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { authService } from '@/services/authService'

export function BeneficiaryChart() {
  const [beneficiaryGroups, setBeneficiaryGroups] = useState<
    BeneficiaryGroupDTO[]
  >([])
  const [beneficiarySubgroups, setBeneficiarySubgroups] = useState<
    BeneficiarySubGroupDTO[]
  >([])
  const [beneficiaryGroup, setBeneficiaryGroup] =
    useState<BeneficiaryGroupDTO>()

  const toast = useToast()
  const { filters } = useDashboard()

  const showBackButton =
    typeof filters.beneficiaryGroupId !== 'number' ||
    beneficiaryGroups.length !== 1

  async function fetchSubGroups(group: BeneficiaryGroupDTO) {
    try {
      const data = await beneficiarySubGroupService.getByGroupId(group.id)
      setBeneficiarySubgroups(data || [])
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  function handleSetGroup(group: BeneficiaryGroupDTO | undefined) {
    setBeneficiaryGroup(group)
  }

  useEffect(() => {
    setBeneficiaryGroup(undefined)
    setBeneficiarySubgroups([])
    const { typeUser } = authService.getUserAuth()

    ;(async function () {
      try {
        let data
        if (typeUser === 'LIMITED_ACCREDITOR') {
          data = await beneficiaryGroupService.getByUser({
            accreditorId: filters.accreditorId,
          })
        } else {
          data = await beneficiaryGroupService.getByAccreditorId(
            filters.accreditorId,
          )
        }

        const beneficiaryGroupsActive = data?.filter(
          (item) => item.status === 'ENABLED',
        )

        setBeneficiaryGroups(beneficiaryGroupsActive || [])

        const hasOnlyOneBeneficiaryGroups =
          beneficiaryGroupsActive?.length === 1

        if (hasOnlyOneBeneficiaryGroups) {
          const [group] = beneficiaryGroupsActive
          setBeneficiaryGroup(group)
          return
        }

        const hasFiltered = typeof filters.beneficiaryGroupId === 'number'

        if (hasFiltered) {
          const group = data?.find(
            (item) => item.id === filters.beneficiaryGroupId,
          )
          setBeneficiaryGroup(group)
        }
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    })()
  }, [filters])

  useEffect(() => {
    if (beneficiaryGroup) {
      fetchSubGroups(beneficiaryGroup)
    } else {
      setBeneficiarySubgroups([])
    }
  }, [beneficiaryGroup])

  return (
    <GraphProvider title="Grupo de Beneficiário" hasView={false}>
      {showBackButton && (
        <IconButton onClick={() => setBeneficiaryGroup(undefined)}>
          <ArrowBack />
        </IconButton>
      )}
      <GridBox column={5}>
        <S.Content
          style={{
            gridColumn: 'span 2',
          }}
        >
          <PieChart
            beneficiaryGroups={beneficiaryGroups}
            beneficiarySubGroups={beneficiarySubgroups}
            handleGroup={handleSetGroup}
            beneficiaryGroup={beneficiaryGroup}
          />
        </S.Content>
        <S.Content
          style={{
            gridColumn: 'span 3',
          }}
        >
          <BarChart
            beneficiaryGroups={beneficiaryGroups}
            beneficiarySubGroups={beneficiarySubgroups}
            handleGroup={handleSetGroup}
            beneficiaryGroup={beneficiaryGroup}
          />
        </S.Content>
      </GridBox>
    </GraphProvider>
  )
}
