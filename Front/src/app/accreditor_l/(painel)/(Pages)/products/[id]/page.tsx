'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TextField } from '@mui/material'
import { CustomBox } from '@/components/CustomBox'
import { useToast } from '@/hooks/useToast'
import { ProductInputDTO } from '@/dtos/Product'
import { productService } from '@/services/productService'
import { ProductGroupDTO } from '@/dtos/ProductGroup'
import { productGroupService } from '@/services/productGroupService'
import { Container } from '@/components/Container'
import { GridBox } from '@/components/GridBox'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { ValueDTO } from '@/dtos/Value'
import { valueService } from '@/services/valueService'
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

  const {
    register,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductInputDTO>({})

  const { status, productGroupId } = watch()
  const toast = useToast()

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

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
    },
    {
      field: 'effectiveDate',
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
              href: '/accreditor_l',
              description: 'Home',
            },
            {
              href: '/accreditor_l/products',
              description: 'Produtos',
            },
            {
              description: 'Detalhes',
            },
          ]}
        />
      </NavigationContainer>
      <CustomBox title="Produto" checked={status === 'ENABLED'}>
        <GridBox column={6}>
          <TextField
            inputProps={{ readOnly: true }}
            label="Descrição"
            error={!!errors.name?.message}
            helperText={errors.name?.message}
            InputLabelProps={{ shrink: true }}
            size="small"
            sx={{ gridColumn: 'span 3' }}
            {...register('name')}
          />
          <TextField
            inputProps={{ readOnly: true }}
            label="Código"
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
            label="Grupo de Produtos"
            onChange={(o) => setValue('accreditorId', Number(o?.id))}
          />

          <TextField
            inputProps={{ readOnly: true }}
            InputLabelProps={{ shrink: true }}
            label="Observação"
            multiline
            size="small"
            sx={{ gridColumn: 'span 6' }}
            {...register('obs')}
          />
        </GridBox>
      </CustomBox>
      <CustomBox title="Valores anteriores">
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
    </Container>
  )
}
