'use client'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { CustomBox } from '@/components/CustomBox'
import { IconButton, Tooltip } from '@mui/material'
import { ContentCopy, Plagiarism } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/useToast'
import { Container } from '@/components/Container'
import { accreditedService, Accredited } from '@/services/accreditedService'
import { NavigationContainer } from '@/components/NavigationContainer'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { useAccreditor } from '@/hooks/useAccreditor'

export default function AccreditedPage() {
  const [accrediteds, setAccrediteds] = useState<Accredited[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { accreditor } = useAccreditor()

  const { push } = useRouter()
  const toast = useToast()

  async function fetchAccrediteds() {
    try {
      setIsLoading(true)
      const accreditedData = await accreditedService.getByAccreditor(
        accreditor.id,
      )
      setAccrediteds(accreditedData || [])
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (accreditor.id) {
      fetchAccrediteds()
    }
  }, [accreditor])

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'companyId',
      headerName: 'Credenciado',
      flex: 1,
      minWidth: 320,
      valueGetter: (params) => params.row.accreditedCompany.name,
    },
    {
      field: 'credential',
      headerName: 'Credencial',
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            navigator.clipboard.writeText(params.row.credential)
            toast.success('Credencial copiada para área de transferência.')
          }}
        >
          <Tooltip title="Copiar Credencial">
            <ContentCopy />
          </Tooltip>
        </IconButton>
      ),
    },

    {
      field: 'actions',
      headerName: 'Visualizar',
      sortable: false,
      editable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => (
        <div key={params.id}>
          <IconButton onClick={() => push(`accreditations/${params.row.id}`)}>
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
              href: '/accreditor',
              description: 'Home',
            },
            {
              description: 'Credenciamentos',
            },
          ]}
        />
      </NavigationContainer>
      <CustomBox title="Credenciamentos">
        <DataGrid
          rows={accrediteds}
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
