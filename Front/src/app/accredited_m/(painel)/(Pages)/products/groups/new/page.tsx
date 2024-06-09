'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TextField, Button } from '@mui/material'
import { CustomBox } from '@/components/CustomBox'
import { useToast } from '@/hooks/useToast'
import { ProductGroupInputDTO } from '@/dtos/ProductGroup'
import { productGroupService } from '@/services/productGroupService'
import { Container } from '@/components/Container'
import { Form } from '@/components/Form'
import { Footer } from '@/components/Footer'
import { GridBox } from '@/components/GridBox'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'
import { useAccreditor } from '@/hooks/useAccreditor'

export default function CreteProductGroupPage() {
  const { accreditor } = useAccreditor()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductGroupInputDTO>({
    defaultValues: {
      status: 'ENABLED',
    },
  })

  const status = watch('status')

  async function handleConfirmForm(group: ProductGroupInputDTO) {
    try {
      await productGroupService.create(group)
      toast.success('Grupo de Produto cadastrado com sucesso.')
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  useEffect(() => {
    setValue('accreditorId', accreditor.id)
  }, [accreditor])

  return (
    <Container>
      <NavigationContainer>
        <Breadcrumb
          crumbs={[
            {
              href: '/accredited_m',
              description: 'Home',
            },
            {
              href: '/accredited_m/products',
              description: 'Produtos',
            },
            {
              href: '/accredited_m/products/groups',
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
          title="Novo Grupo de Produto"
          checked={status === 'ENABLED'}
          onToggleStatus={() =>
            setValue('status', status === 'ENABLED' ? 'DISABLED' : 'ENABLED')
          }
        >
          <GridBox>
            <TextField
              label="Descrição"
              required
              error={!!errors.name?.message}
              helperText={errors.name?.message}
              size="small"
              {...register('name')}
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
