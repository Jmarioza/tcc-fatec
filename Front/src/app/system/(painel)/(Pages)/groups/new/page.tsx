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
import { useRouter } from 'next/navigation'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'
import { useAccreditor } from '@/hooks/useAccreditor'

export default function CreateGroupPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BeneficiaryGroupInputDTO>({
    defaultValues: {
      status: 'ENABLED',
    },
  })

  const { status } = watch()
  const { getAccreditor } = useAccreditor()
  const accreditor = getAccreditor()

  const toast = useToast()
  const { push } = useRouter()

  async function handleConfirmForm(group: BeneficiaryGroupInputDTO) {
    try {
      const res = await beneficiaryGroupService.create(group)
      toast.success('Grupo cadastrado com sucesso.')
      if (res?.id) push('./')
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  useEffect(() => {
    if (accreditor.id) setValue('accreditorId', accreditor.id)
  }, [accreditor])

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
              description: 'Novo',
            },
          ]}
        />
      </NavigationContainer>
      <Form onSubmit={handleSubmit(handleConfirmForm)}>
        <CustomBox
          title="Novo Grupo"
          checked={status === 'ENABLED'}
          onToggleStatus={() =>
            setValue('status', status === 'ENABLED' ? 'DISABLED' : 'ENABLED')
          }
        >
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
