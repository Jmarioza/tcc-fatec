'use client'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { CustomBox } from '@/components/CustomBox'
import { IconButton, Tooltip, Switch } from '@mui/material'
import { Plagiarism } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/useToast'
import { ProductGroupDTO } from '@/dtos/ProductGroup'
import { productGroupService } from '@/services/productGroupService'
import { Container } from '@/components/Container'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'
import { useAccreditor } from '@/hooks/useAccreditor'

export default function ProductGroupScreen() {
  const [groups, setGroups] = useState<ProductGroupDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { accreditor } = useAccreditor()
  const { push } = useRouter()
  const toast = useToast()

  useEffect(() => {
    if (accreditor.id) {
      ;(async function () {
        try {
          setIsLoading(true)
          const data = await productGroupService.getByAccreditor(accreditor.id)
          setGroups(data || [])
        } catch (error) {
          if (error instanceof Error) toast.error(error.message)
        } finally {
          setIsLoading(false)
        }
      })()
    }
  }, [accreditor])

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Descrição', flex: 1, minWidth: 320 },
    {
      field: 'status',
      headerName: 'Status',
      sortable: false,
      editable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => (
        <div key={params.id}>
          <Switch checked={params.row.status === 'ENABLED'} />
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
          <IconButton onClick={() => push(`groups/${params.row.id}`)}>
            <Tooltip title="Visualizar">
              <Plagiarism />
            </Tooltip>
          </IconButton>
        </div>
      ),
    },
  ]

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
              description: 'Grupos',
            },
          ]}
        />
      </NavigationContainer>

      <CustomBox title="Grupo de Produtos">
        <DataGrid
          rows={groups}
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
    </Container>
  )
}
