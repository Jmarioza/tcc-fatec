'use client'
import { useEffect, useState } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { CustomBox } from '@/components/CustomBox'
import { IconButton, Tooltip, Switch, Button } from '@mui/material'
import { Edit, Delete, Category } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/useToast'
import { useConfirmationModal } from '@/hooks/useModal'
import { Product, productService } from '@/services/productService'
import { Container } from '@/components/Container'
import { findCurrentProduct } from '@/func/findCurrentProduct'
import { Footer } from '@/components/Footer'
import { valueService } from '@/services/valueService'
import { productGroupService } from '@/services/productGroupService'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'
import { useAccreditor } from '@/hooks/useAccreditor'
import { ReportModal } from '@/components/Report/Modal/Product'
export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCanEdit, setIsCanEdit] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  const { accreditor } = useAccreditor()
  const { push } = useRouter()
  const toast = useToast()
  const { openModal } = useConfirmationModal()

  async function fetchAllProducts() {
    try {
      setIsLoading(true)
      const data = await productService.getByAccreditor(accreditor.id)
      if (data) {
        const productsData: Product[] = []
        for (const item of data) {
          const [valuesData, groupData] = await Promise.all([
            valueService.getByProductId(item.id),
            productGroupService.getById(item.productGroupId),
          ])
          productsData.push({
            ...item,
            values: valuesData,
            group: groupData,
          })
        }
        setProducts(productsData)
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleToggleSwitch(productId: number) {
    try {
      setIsLoading(true)
      const findProduct = products.find((product) => product.id === productId)
      const newStatus =
        findProduct?.status === 'DISABLED' ? 'ENABLED' : 'DISABLED'
      await productService.update(productId, { status: newStatus })
      setProducts((prevState) =>
        prevState.map((product) =>
          product.id === productId
            ? {
                ...product,
                status: newStatus,
              }
            : product,
        ),
      )
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (accreditor.id) {
      fetchAllProducts()
    }
  }, [accreditor])

  const columns: GridColDef[] = [
    { field: 'code', headerName: 'Código', width: 180 },
    { field: 'name', headerName: 'Descrição', flex: 1, minWidth: 320 },
    {
      field: 'productGroupId',
      headerName: 'Grupo de Produto',
      minWidth: 160,
      valueGetter: (params) => params.row.group.name,
    },
    {
      field: 'valueCoparticipation',
      headerName: 'Coparticipação',
      minWidth: 160,
      valueGetter: (params) => {
        const value = findCurrentProduct(params.row.values)
          ?.valueCoparticipation
        if (!value) {
          return '---'
        }
        return new Intl.NumberFormat('pt-BR', {
          currency: 'BRL',
          style: 'currency',
        }).format(Number(value))
      },
    },
    {
      field: 'valueProduct',
      headerName: 'Valor do Produto',
      minWidth: 160,
      valueGetter: (params) => {
        const value = findCurrentProduct(params.row.values)?.valueProduct
        if (!value) {
          return '---'
        }
        return new Intl.NumberFormat('pt-BR', {
          currency: 'BRL',
          style: 'currency',
        }).format(Number(value))
      },
    },

    {
      field: 'status',
      headerName: 'Status',
      sortable: false,
      editable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => (
        <div key={params.id}>
          <Tooltip
            title={params.row.status === 'DISABLED' ? 'Ativar' : 'Desativar'}
          >
            <Switch
              checked={params.row.status === 'ENABLED'}
              onChange={() => handleToggleSwitch(params.row.id)}
              disabled={!isCanEdit}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Ações',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      editable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => (
        <div key={params.id}>
          <IconButton onClick={() => push(`products/${params.row.id}`)}>
            <Tooltip title="Editar">
              <Edit />
            </Tooltip>
          </IconButton>
          <IconButton
            onClick={() =>
              openModal(async () => {
                try {
                  await productService.deleteById(params.row.id)
                  await fetchAllProducts()
                  toast.success('Produto excluído com sucesso.')
                } catch (error) {
                  if (error instanceof Error) {
                    toast.error(error.message)
                  }
                }
              })
            }
          >
            <Tooltip title="Remover">
              <Delete />
            </Tooltip>
          </IconButton>
        </div>
      ),
    },
  ]

  return (
    <Container>
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(!isReportModalOpen)}
      />
      <NavigationContainer>
        <Breadcrumb
          crumbs={[
            {
              href: '/accredited_m',
              description: 'Home',
            },
            {
              description: 'Produtos',
            },
          ]}
        />
      </NavigationContainer>

      <CustomBox
        title="Produtos"
        onAdd={() => push('products/new')}
        onToggleEdit={() => setIsCanEdit(!isCanEdit)}
      >
        <DataGrid
          rows={products}
          columns={columns}
          pageSizeOptions={[5, 50]}
          loading={isLoading}
          density="compact"
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
        />
      </CustomBox>

      <Footer>
        <Button
          startIcon={<Category />}
          variant="outlined"
          onClick={() => push('products/groups')}
        >
          Grupo de Produto
        </Button>
      </Footer>
    </Container>
  )
}
