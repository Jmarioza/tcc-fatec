import { BeneficiaryGroupDTO } from '@/dtos/BeneficiaryGroup'
import { useToast } from '@/hooks/useToast'
import { beneficiaryGroupService } from '@/services/beneficiaryGroupService'
import { userAccreditorBeneficiaryGroupService } from '@/services/userAccreditorBeneficiaryGroupService'
import { Switch } from '@mui/material'
import { useEffect, useState } from 'react'

interface UserBeneficiaryGroupProps {
  userId: number
  accreditorId: number
}
export function UserBeneficiaryGroup({
  accreditorId,
  userId,
}: UserBeneficiaryGroupProps) {
  const [beneficiaryGroups, setBeneficiaryGroups] = useState<
    BeneficiaryGroupDTO[]
  >([])
  const [activeGroups, setActiveGroups] = useState<number[]>([])

  const toast = useToast()

  function isCheckedBeneficiaryGroup(group: BeneficiaryGroupDTO) {
    return activeGroups.some((item) => item === group.id)
  }

  async function handleCheckedBeneficiaryGroup(
    isActive: boolean,
    group: BeneficiaryGroupDTO,
  ) {
    if (isActive) {
      try {
        await userAccreditorBeneficiaryGroupService.create({
          id: {
            userId,
            accreditorId,
            beneficiaryGroupId: group.id,
          },
        })
        setActiveGroups((prevState) => [...prevState, group.id])
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    } else {
      try {
        await userAccreditorBeneficiaryGroupService.deleteById({
          userId,
          accreditorId,
          beneficiaryGroupId: group.id,
        })
        setActiveGroups((prevState) =>
          prevState.filter((state) => state !== group.id),
        )
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    }
  }

  useEffect(() => {
    ;(async function () {
      try {
        const [groupsResponse, activeGroupsResponse] = await Promise.all([
          beneficiaryGroupService.getByAccreditorId(accreditorId),
          userAccreditorBeneficiaryGroupService.get({
            accreditorId,
            userId,
          }),
        ])
        setBeneficiaryGroups(groupsResponse || [])
        if (activeGroupsResponse) {
          setActiveGroups(
            activeGroupsResponse.map((item) => item.beneficiaryGroupId),
          )
        }
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    })()
  }, [])

  return (
    <div>
      <div
        style={{
          marginLeft: '2rem',
        }}
      >
        <table>
          <tbody>
            {beneficiaryGroups.map((group) => (
              <tr key={group.id}>
                <td>{group.name}</td>
                <td>
                  <Switch
                    checked={isCheckedBeneficiaryGroup(group)}
                    onChange={(e) =>
                      handleCheckedBeneficiaryGroup(e.target.checked, group)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
