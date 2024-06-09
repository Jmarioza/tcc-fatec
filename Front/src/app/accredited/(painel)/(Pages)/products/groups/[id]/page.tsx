'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TextField } from '@mui/material'
import { CustomBox } from '@/components/CustomBox'
import { useToast } from '@/hooks/useToast'
import { ProductGroupInputDTO } from '@/dtos/ProductGroup'
import { productGroupService } from '@/services/productGroupService'
import { Container } from '@/components/Container'
import { Form } from '@/components/Form'
import { GridBox } from '@/components/GridBox'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'

interface Props {
  params: {
    id: string
  }
}

export default function CreteProductGroupPage({ params: { id } }: Props) {
  const {
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductGroupInputDTO>({
    defaultValues: {
      status: 'ENABLED',
    },
  })

  const status = watch('status')
  const toast = useToast()

  useEffect(() => {
    async function fetchProductGroup() {
      try {
        const data = await productGroupService.getById(Number(id))
        if (data) reset(data)
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    }
    fetchProductGroup()
  }, [])

  return (
    <Container>
      <NavigationContainer>
        <Breadcrumb
          crumbs={[
            {
              href: '/accredited',
              description: 'Home',
            },
            {
              href: '/accredited/products',
              description: 'Produtos',
            },
            {
              href: '/accredited/products/groups',
              description: 'Grupos',
            },
            {
              description: 'Detalhes',
            },
          ]}
        />
      </NavigationContainer>
      <Form>
        <CustomBox
          title="Detalhes do Grupo de Produto"
          checked={status === 'ENABLED'}
        >
          <GridBox>
            <TextField
              label="Descrição"
              required
              error={!!errors.name?.message}
              helperText={errors.name?.message}
              size="small"
              {...register('name')}
              InputLabelProps={{ shrink: true }}
            />
          </GridBox>
        </CustomBox>
      </Form>
    </Container>
  )
}
