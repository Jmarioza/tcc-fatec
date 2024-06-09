'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TextField, Button } from '@mui/material'
import { CustomBox } from '@/components/CustomBox'
import { useToast } from '@/hooks/useToast'
import { ProductDTO } from '@/dtos/Product'
import { productService } from '@/services/productService'
import { Container } from '@/components/Container'
import { Form } from '@/components/Form'
import { Footer } from '@/components/Footer'
import { GridBox } from '@/components/GridBox'
import { ValueInputDTO } from '@/dtos/Value'
import { valueService } from '@/services/valueService'
import { useRouter } from 'next/navigation'
import { NumericFormat } from 'react-number-format'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'

interface Props {
  params: {
    id: string
  }
}

export default function ValueProductPage({ params: { id } }: Props) {
  const [product, setProduct] = useState<ProductDTO>({} as ProductDTO)

  const {
    register,
    handleSubmit,
    watch,
    setValue,

    formState: { errors, isSubmitting },
  } = useForm<ValueInputDTO>({
    defaultValues: {
      status: 'ENABLED',
    },
  })

  const { status, valueCoparticipation, valueProduct } = watch()
  const toast = useToast()
  const { push } = useRouter()

  async function handleConfirmForm(value: ValueInputDTO) {
    try {
      const res = await valueService.create(value)
      toast.success('Valor adicionado com sucesso.')
      if (res?.id) push('./')
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await productService.getById(Number(id))
        if (data) {
          setProduct(data)
          setValue('productId', data.id)
          setValue('accreditorId', data.accreditorId)
        }
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    }
    fetchProduct()
  }, [])

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
              href: `/accredited_m/products/${id}`,
              description: 'Produto',
            },
            {
              description: 'Valores',
            },
          ]}
        />
      </NavigationContainer>
      <Form onSubmit={handleSubmit(handleConfirmForm)}>
        <CustomBox
          title={`Adicionar valor ao ${product.name}`}
          checked={status === 'ENABLED'}
          onToggleStatus={() =>
            setValue('status', status === 'ENABLED' ? 'DISABLED' : 'ENABLED')
          }
        >
          <GridBox column={3}>
            <NumericFormat
              label="Produto"
              prefix="R$ "
              value={valueProduct}
              required={true}
              error={!!errors.valueProduct?.message}
              helperText={errors.valueProduct?.message}
              size="small"
              allowNegative={false}
              decimalScale={2}
              fixedDecimalScale
              decimalSeparator=","
              customInput={TextField}
              onValueChange={(values) => {
                setValue('valueProduct', Number(values.floatValue))
              }}
            />
            <NumericFormat
              label="Taxa Administrativa"
              prefix="R$ "
              value={valueCoparticipation}
              required={true}
              error={!!errors.valueCoparticipation?.message}
              helperText={errors.valueCoparticipation?.message}
              size="small"
              allowNegative={false}
              decimalScale={2}
              fixedDecimalScale
              decimalSeparator=","
              customInput={TextField}
              onValueChange={(values) => {
                setValue('valueCoparticipation', Number(values.floatValue))
              }}
            />
            <TextField
              label="Data de Inicio da vigência"
              required
              error={!!errors.effectiveDate?.message}
              helperText={errors.effectiveDate?.message}
              size="small"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register('effectiveDate', {
                valueAsDate: true,
              })}
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
