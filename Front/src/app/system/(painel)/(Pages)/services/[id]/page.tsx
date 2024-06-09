'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TextField, Button } from '@mui/material'
import { CustomBox } from '@/components/CustomBox'
import { useToast } from '@/hooks/useToast'
import { ServiceTypeInputDTO } from '@/dtos/ServiceType'
import { serviceTypeService } from '@/services/serviceTypeService'
import { Container } from '@/components/Container'
import { Form } from '@/components/Form'
import { Footer } from '@/components/Footer'
import { GridBox } from '@/components/GridBox'
import { useRouter } from 'next/navigation'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'
import { SERVICE_TYPE } from '@/constants/servviceType'

interface Props {
  params: {
    id: string
  }
}

export default function CreateTypeService({ params: { id } }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ServiceTypeInputDTO>({})

  const status = watch('status')
  const toast = useToast()
  const { push } = useRouter()

  async function handleConfirmForm(typeService: ServiceTypeInputDTO) {
    try {
      await serviceTypeService.update(Number(id), typeService)
      toast.success('Tipo de serviço modificado com sucesso.')
      push('./')
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  useEffect(() => {
    async function fetchTypeServiceById() {
      try {
        const data = await serviceTypeService.getById(Number(id))
        if (data) reset(data)
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    }
    fetchTypeServiceById()
  }, [])

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
              description: 'Detalhes',
            },
          ]}
        />
      </NavigationContainer>
      <Form onSubmit={handleSubmit(handleConfirmForm)}>
        <CustomBox
          title="Tipos de Serviço"
          checked={status === 'ENABLED'}
          onToggleStatus={() =>
            setValue('status', status === 'ENABLED' ? 'DISABLED' : 'ENABLED')
          }
        >
          <GridBox column={8}>
            <TextField
              InputLabelProps={{ shrink: true }}
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
