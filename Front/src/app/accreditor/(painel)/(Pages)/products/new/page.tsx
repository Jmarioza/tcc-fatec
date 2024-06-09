'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TextField, Button } from '@mui/material'
import { CustomBox } from '@/components/CustomBox'
import { useToast } from '@/hooks/useToast'
import { ProductInputDTO } from '@/dtos/Product'
import { productService } from '@/services/productService'
import { ProductGroupDTO } from '@/dtos/ProductGroup'
import { productGroupService } from '@/services/productGroupService'
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
import { Autocomplete } from '@/components/Autocomplete'
import { useAccreditor } from '@/hooks/useAccreditor'

interface ProductInput extends ProductInputDTO, ValueInputDTO {}

export default function CreateProductPage() {
  const [productGroups, setProductGroups] = useState<ProductGroupDTO[]>([])

  const { accreditor } = useAccreditor()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    defaultValues: {
      status: 'ENABLED',
    },
  })

  const { status, valueCoparticipation, valueProduct, productGroupId } = watch()
  const toast = useToast()
  const { push } = useRouter()

  async function handleConfirmForm(product: ProductInput) {
    try {
      const res = await productService.create(product)
      if (res?.id && product.valueCoparticipation) {
        await valueService.create({ ...product, productId: res.id })
      }
      toast.success('Produto cadastrado com sucesso.')
      push('./')
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  useEffect(() => {
    if (accreditor.id) {
      ;(async function () {
        try {
          const data = await productGroupService.getByAccreditor(accreditor.id)
          setValue('accreditorId', accreditor.id)
          setProductGroups(data || [])
        } catch (error) {
          if (error instanceof Error) toast.error(error.message)
        }
      })()
    }
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
              description: 'Novo',
            },
          ]}
        />
      </NavigationContainer>
      <Form onSubmit={handleSubmit(handleConfirmForm)}>
        <CustomBox
          title="Novo Produto"
          checked={status === 'ENABLED'}
          onToggleStatus={() =>
            setValue('status', status === 'ENABLED' ? 'DISABLED' : 'ENABLED')
          }
        >
          <GridBox column={6}>
            <TextField
              label="Código"
              required
              error={!!errors.code?.message}
              helperText={errors.code?.message}
              size="small"
              {...register('code')}
            />
            <TextField
              label="Descrição"
              required
              error={!!errors.name?.message}
              helperText={errors.name?.message}
              sx={{ gridColumn: 'span 3' }}
              size="small"
              {...register('name')}
            />

            <Autocomplete
              sx={{ gridColumn: 'span 2' }}
              getValue={() =>
                productGroups.find((item) => item.id === productGroupId)
              }
              options={productGroups}
              getOptionKey={(o) => o?.id}
              getOptionLabel={(o) => o?.name}
              label="Grupo de Produto"
              onChange={(o) => setValue('productGroupId', Number(o?.id))}
              errorMessage={errors.productGroupId?.message}
            />

            <TextField
              InputLabelProps={{ shrink: true }}
              label="Observação"
              multiline
              size="small"
              sx={{ gridColumn: 'span 6' }}
              {...register('obs')}
            />
          </GridBox>
        </CustomBox>
        <CustomBox title="Definição de valor">
          <GridBox column={4}>
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
              InputLabelProps={{ shrink: true }}
              label="Data de Inicio da vigência"
              required
              type="date"
              error={!!errors.effectiveDate?.message}
              helperText={errors.effectiveDate?.message}
              size="small"
              {...register('effectiveDate')}
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
