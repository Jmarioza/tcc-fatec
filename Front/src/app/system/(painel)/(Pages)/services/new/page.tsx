'use client'
import { useForm } from 'react-hook-form'
import { TextField, Button } from '@mui/material'
import { CustomBox } from '@/components/CustomBox'
import { useToast } from '@/hooks/useToast'
import { ServiceTypeInputDTO } from '@/dtos/ServiceType'
import { serviceTypeService } from '@/services/serviceTypeService'
import { Form } from '@/components/Form'
import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { GridBox } from '@/components/GridBox'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'
import { SERVICE_TYPE } from '@/constants/servviceType'
import { useRouter } from 'next/navigation'

export default function CreateTypeService() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ServiceTypeInputDTO>({
    defaultValues: {
      status: 'ENABLED',
    },
  })

  const status = watch('status')
  const { push } = useRouter()
  const toast = useToast()

  async function handleConfirmForm(typeService: ServiceTypeInputDTO) {
    try {
      await serviceTypeService.create(typeService)
      toast.success('Tipo de serviço cadastrado com sucesso.')
      push('./')
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
              href: '/system/services',
              description: 'Serviços',
            },
            {
              description: 'Novo',
            },
          ]}
        />
      </NavigationContainer>
      <Form onSubmit={handleSubmit(handleConfirmForm)}>
        <CustomBox
          title="Tipos de Serviço"
          onToggleStatus={() =>
            setValue('status', status === 'ENABLED' ? 'DISABLED' : 'ENABLED')
          }
          checked={status === 'ENABLED'}
        >
          <GridBox column={8}>
            <TextField
              label="Descrição"
              required
              error={!!errors.name?.message}
              helperText={errors.name?.message}
              size="small"
              sx={{ gridColumn: 'span 6' }}
              {...register('name')}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
              label="Tipo de Serviço"
              required
              error={!!errors.type?.message}
              helperText={errors.type?.message}
              size="small"
              select
              sx={{ gridColumn: 'span 2' }}
              SelectProps={{
                native: true,
                inputProps: { ...register('type') },
              }}
            >
              {SERVICE_TYPE.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </TextField>
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
