'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TextField, Button } from '@mui/material'
import { CustomBox } from '@/components/CustomBox'
import { useToast } from '@/hooks/useToast'
import { BeneficiaryGroupInputDTO } from '@/dtos/BeneficiaryGroup'
import { beneficiaryGroupService } from '@/services/beneficiaryGroupService'
import { Container } from '@/components/Container'
import { Form } from '@/components/Form'
import { Footer } from '@/components/Footer'
import { GridBox } from '@/components/GridBox'
import { SubGroupScreen } from './subgroups'
import { useRouter } from 'next/navigation'
import { NavigationContainer } from '@/components/NavigationContainer'
import { Breadcrumb } from '@/components/Breadcrumbs'

interface Props {
  params: {
    id: string
  }
}

export default function GroupPage({ params: { id } }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BeneficiaryGroupInputDTO>({})

  const status = watch('status')
  const toast = useToast()
  const { push } = useRouter()

  async function handleConfirmForm(group: BeneficiaryGroupInputDTO) {
    try {
      await beneficiaryGroupService.update(Number(id), group)
      toast.success('Grupo modificado com sucesso.')
      push('./')
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  useEffect(() => {
    async function findGroupById() {
      try {
        const data = await beneficiaryGroupService.getById(Number(id))
        if (data) reset(data)
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    }
    findGroupById()
  }, [])

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
              description: 'Detalhes',
            },
          ]}
        />
      </NavigationContainer>
      <Form onSubmit={handleSubmit(handleConfirmForm)}>
        <CustomBox
          title="Grupo"
          checked={status === 'ENABLED'}
          onToggleStatus={() =>
            setValue('status', status === 'ENABLED' ? 'DISABLED' : 'ENABLED')
          }
        >
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
        <SubGroupScreen groupId={Number(id)} />
        <Footer>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Confirmar
          </Button>
        </Footer>
      </Form>
    </Container>
  )
}
