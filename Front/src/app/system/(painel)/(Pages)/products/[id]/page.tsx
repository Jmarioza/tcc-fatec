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
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { ValueDTO } from '@/dtos/Value'
import { valueService } from '@/services/valueService'
import { useRouter } from 'next/navigation'
import { accreditorService } from '@/services/accreditorService'
import { companyService } from '@/services/companyService'
import { CompanyDTO } from '@/dtos/Company'
import { formatDate } from '@/func/formmatter'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'
import { Autocomplete } from '@/components/Autocomplete'

interface Props {
  params: {
    id: string
  }
}

export default function CreateProductPage({ params: { id } }: Props) {
  const [productGroups, setProductGroups] = useState<ProductGroupDTO[]>([])
  const [values, setValues] = useState<ValueDTO[]>([])
  const [company, setCompany] = useState<CompanyDTO>({} as CompanyDTO)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductInputDTO>({})

  const { status, accreditorId, productGroupId } = watch()
  const toast = useToast()
  const { push } = useRouter()

  async function handleConfirmForm(product: ProductInputDTO) {
    try {
      await productService.update(Number(id), product)
      toast.success('Produto modificado com sucesso.')
      push('./')
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  useEffect(() => {
    async function fetchProductGroup() {
      try {
        const data = await productGroupService.getAll()
        if (data) setProductGroups(data)
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    }

    fetchProductGroup()
  }, [])

  useEffect(() => {
    async function fetchProductById() {
      try {
        const [product, values] = await Promise.all([
          productService.getById(Number(id)),
          valueService.getByProductId(Number(id)),
        ])
        if (product) reset(product)
        setValues(values || [])
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    }
    fetchProductById()
  }, [])

  useEffect(() => {
    async function fetchAccreditorId() {
      if (accreditorId) {
        try {
          const data = await accreditorService.getById(Number(accreditorId))
          if (data) {
            const dataCompany = await companyService.getById(data.companyId)
            if (dataCompany) setCompany(dataCompany)
          }
        } catch (error) {
          if (error instanceof Error) toast.error(error.message)
        }
      }
    }
    fetchAccreditorId()
  }, [accreditorId])

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
    },

    {
      field: 'effectiveDate2',
      headerName: 'Data de Vigência',
      minWidth: 160,
      valueGetter: (params) => formatDate(new Date(params.row.effectiveDate)),
    },
    {
      field: 'valueProduct',
      headerName: 'Valor do produto',
      minWidth: 160,
      valueGetter: (params) =>
        new Intl.NumberFormat('pt-BR', {
          currency: 'BRL',
          style: 'currency',
        }).format(Number(params.row.valueProduct)),
    },
    {
      field: 'valueCoparticipation',
      headerName: 'Valor da coparticipação',
      minWidth: 160,
      valueGetter: (params) =>
        new Intl.NumberFormat('pt-BR', {
          currency: 'BRL',
          style: 'currency',
        }).format(Number(params.row.valueCoparticipation)),
    },
  ]

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
              href: '/system/products',
              description: 'Produtos',
            },
            {
              description: 'Detalhes',
            },
          ]}
        />
      </NavigationContainer>
      <Form onSubmit={handleSubmit(handleConfirmForm)}>
        <CustomBox
          title="Produto"
          checked={status === 'ENABLED'}
          onToggleStatus={() =>
            setValue('status', status === 'ENABLED' ? 'DISABLED' : 'ENABLED')
          }
        >
          <GridBox column={6}>
            <TextField
              InputLabelProps={{ shrink: true }}
              label="Credenciadora"
              size="small"
              sx={{ gridColumn: 'span 6' }}
              value={company.name}
              inputProps={{ readOnly: true }}
            />
            <TextField
              label="Descrição"
              required
              error={!!errors.name?.message}
              helperText={errors.name?.message}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ gridColumn: 'span 3' }}
              {...register('name')}
            />
            <TextField
              label="Código"
              required
              error={!!errors.code?.message}
              helperText={errors.code?.message}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ gridColumn: 'span 2' }}
              {...register('code')}
            />

            <Autocomplete
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
        <CustomBox
          title="Valores anteriores"
          onAdd={() => push(`${id}/values`)}
        >
          <DataGrid
            rows={values}
            columns={columns}
            pageSizeOptions={[5, 50]}
            density="compact"
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
          />
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
