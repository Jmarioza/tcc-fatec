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
import { NavigationContainer } from '@/components/NavigationContainer'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { useAccreditor } from '@/hooks/useAccreditor'

export default function CreteProductGroupPage() {
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

  const { accreditor } = useAccreditor()
  const status = watch('status')
  const toast = useToast()

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
              href: '/accreditor',
              description: 'Home',
            },
            {
              href: '/accreditor/products',
              description: 'Produtos',
            },
            {
              href: '/accreditor/products/groups',
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
