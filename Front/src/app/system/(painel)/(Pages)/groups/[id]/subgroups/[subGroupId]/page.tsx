'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { TextField, Button } from '@mui/material'
import { CustomBox } from '@/components/CustomBox'
import { useToast } from '@/hooks/useToast'
import { BeneficiaryGroupDTO } from '@/dtos/BeneficiaryGroup'
import { BeneficiarySubGroupInputDTO } from '@/dtos/BeneficiarySubGroup'
import { beneficiarySubGroupService } from '@/services/beneficiarySubGroupService'
import { beneficiaryGroupService } from '@/services/beneficiaryGroupService'
import { Container } from '@/components/Container'
import { Form } from '@/components/Form'
import { Footer } from '@/components/Footer'
import { GridBox } from '@/components/GridBox'
import { useRouter } from 'next/navigation'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'
import { Info } from '@/components/Info'

interface Props {
  params: {
    id: string
    subGroupId: number
  }
}

export default function CreateSubGroupPage({
  params: { subGroupId, id },
}: Props) {
  const [group, setGroup] = useState<BeneficiaryGroupDTO>(
    {} as BeneficiaryGroupDTO,
  )
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BeneficiarySubGroupInputDTO>({})

  const status = watch('status')
  const toast = useToast()
  const { push } = useRouter()

  useEffect(() => {
    ;(async function fetchSubGroupById() {
      try {
        const [groupData, subGroupData] = await Promise.all([
          beneficiaryGroupService.getById(Number(id)),
          beneficiarySubGroupService.getById(subGroupId),
        ])
        if (groupData && subGroupData) {
          reset(subGroupData)
          setGroup(groupData)
        }
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    })()
  }, [])

  async function handleConfirmForm(group: BeneficiarySubGroupInputDTO) {
    try {
      await beneficiarySubGroupService.update(subGroupId, group)
      toast.success('Subgrupo modificado com sucesso.')
      push('../')
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  return (
    <Container>
      <NavigationContainer>
        <Breadcrumb
          crumbs={[
            {
              href: '/system',
              description: 'Home',
            },
            {
              href: '/system/groups',
              description: 'Grupos',
            },
            {
              href: `/system/groups/${id}`,
              description: 'Grupo',
            },
            {
              href: `/system/groups/${id}/subgroups`,
              description: 'Subgrupos',
            },
            {
              description: 'Detalhe',
            },
          ]}
        />
      </NavigationContainer>
      <Form onSubmit={handleSubmit(handleConfirmForm)}>
        <CustomBox
          title="Subgrupos"
          checked={status === 'ENABLED'}
          onToggleStatus={() =>
            setValue('status', status === 'ENABLED' ? 'DISABLED' : 'ENABLED')
          }
        >
          <Info title="Grupo" description={group.name} />
          <GridBox column={6}>
            <TextField
              label="Descrição"
              required
              error={!!errors.name?.message}
              helperText={errors.name?.message}
              size="small"
              sx={{ gridColumn: 'span 5' }}
              InputLabelProps={{ shrink: true }}
              {...register('name')}
            />
            <TextField
              label="Tag"
              error={!!errors.tag?.message}
              helperText={errors.tag?.message}
              size="small"
              InputLabelProps={{ shrink: true }}
              {...register('tag')}
            />
          </GridBox>
        </CustomBox>
        <Footer>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Confirmar
          </Button>
        </Footer>
      </Form>
    </Container>
  )
}
