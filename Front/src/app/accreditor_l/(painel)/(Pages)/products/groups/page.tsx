'use client'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { CustomBox } from '@/components/CustomBox'
import { Switch } from '@mui/material'
import { useEffect, useState } from 'react'
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

  const toast = useToast()
  const { accreditor } = useAccreditor()

  async function fetchAllGroups() {
    try {
      setIsLoading(true)
      const data = await productGroupService.getByAccreditor(accreditor.id)
      setGroups(data || [])
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (accreditor.id) {
      fetchAllGroups()
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
