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
import { NavigationContainer } from '@/components/NavigationContainer'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { Info } from '@/components/Info'

interface Props {
  params: {
    id: string
  }
}

export default function CreateSubGroupPage({ params: { id } }: Props) {
  const [group, setGroup] = useState<BeneficiaryGroupDTO>(
    {} as BeneficiaryGroupDTO,
  )
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BeneficiarySubGroupInputDTO>({
    defaultValues: {
      status: 'ENABLED',
    },
  })

  const status = watch('status')
  const toast = useToast()
  const { push } = useRouter()

  useEffect(() => {
    ;(async function fetchAllGroups() {
      try {
        const data = await beneficiaryGroupService.getById(Number(id))
        if (data) {
          setGroup(data)
          setValue('beneficiaryGroupId', data.id)
          setValue('accreditorId', data.accreditorId)
        }
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    })()
  }, [])

  async function handleConfirmForm(subGroup: BeneficiarySubGroupInputDTO) {
    try {
      await beneficiarySubGroupService.create(subGroup)
      toast.success('Subgrupo cadastrado com sucesso.')
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
              href: '/accreditor_l',
              description: 'Home',
            },
            {
              href: '/accreditor_l/groups',
              description: 'Grupos',
            },
            {
              href: `/accreditor_l/groups/${id}`,
              description: 'Grupo',
            },
            {
              href: `/accreditor_l/groups/${id}/subgroups`,
              description: 'Subgrupos',
            },
            {
              description: 'Novo',
            },
          ]}
        />
      </NavigationContainer>
      <Form onSubmit={handleSubmit(handleConfirmForm)}>
        <CustomBox
          title="Novo Subgrupo"
          checked={status === 'ENABLED'}
          onToggleStatus={() =>
            setValue('status', status === 'ENABLED' ? 'DISABLED' : 'ENABLED')
          }
        >
          <Info title="Grupo" description={group.name} />
          <GridBox column={6}>
            <TextField
              label="Descrição"
              sx={{ gridColumn: 'span 5' }}
              required
              error={!!errors.name?.message}
              helperText={errors.name?.message}
              size="small"
              {...register('name')}
            />
            <TextField
              label="Tag"
              error={!!errors.tag?.message}
              helperText={errors.tag?.message}
              size="small"
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
