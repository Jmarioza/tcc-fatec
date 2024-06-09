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
import { companyService } from '@/services/companyService'
import { accreditorService } from '@/services/accreditorService'
import { authService } from '@/services/authService'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'

export default function AccreditedPage() {
  const [accredited, setAccredited] = useState<Accredited[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { push } = useRouter()
  const toast = useToast()

  async function fetchAllProducts() {
    try {
      setIsLoading(true)
      const { companyId } = authService.getUserAuth()
      const [companiesData, accreditedsData, accreditorsData] =
        await Promise.all([
          companyService.getAll(),
          accreditedService.getByCompanyId(companyId),
          accreditorService.getByAccreditedCompany(companyId),
        ])

      if (accreditedsData) {
        const accreditedsDataWithRelation: Accredited[] = []
        for (const item of accreditedsData) {
          const acc: Accredited = {
            ...item,
            accreditedCompany: companiesData?.find(
              (i) => i.id === item.companyId,
            ),
            accreditorCompany: companiesData?.find(
              (i) =>
                i.id ===
                accreditorsData?.find((j) => j.id === item.accreditorId)
                  ?.companyId,
            ),
          }
          accreditedsDataWithRelation.push(acc)
        }
        setAccredited(accreditedsDataWithRelation)
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAllProducts()
  }, [])

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'accreditorId',
      headerName: 'Credenciadora',
      flex: 1,
      minWidth: 320,
      valueGetter: (params) => params.row.accreditorCompany.name,
    },
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
              href: '/accredited',
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
          rows={accredited}
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
