'use client'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { CustomBox } from '@/components/CustomBox'
import { IconButton, Tooltip } from '@mui/material'
import { Edit, Delete, ContentCopy } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/useToast'
import { useConfirmationModal } from '@/hooks/useModal'
import { Container } from '@/components/Container'
import { accreditedService, Accredited } from '@/services/accreditedService'
import { companyService } from '@/services/companyService'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'
import { useAccreditor } from '@/hooks/useAccreditor'

export default function AccreditedPage() {
  const [accredited, setAccredited] = useState<Accredited[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const toast = useToast()
  const { push } = useRouter()
  const { openModal } = useConfirmationModal()
  const { accreditor } = useAccreditor()

  async function fetchAllProducts() {
    try {
      setIsLoading(true)
      const [companiesData, accreditedsData] = await Promise.all([
        companyService.getAll(),
        accreditedService.getByAccreditor(accreditor.id),
      ])

      if (accreditedsData) {
        const accreditedsDataWithRelation: Accredited[] = []
        for (const item of accreditedsData) {
          const acc: Accredited = {
            ...item,
            accreditedCompany: companiesData?.find(
              (i) => i.id === item.companyId,
            ),
            accreditorCompany: accreditor.company,
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
    if (accreditor.id) {
      fetchAllProducts()
    }
  }, [accreditor])

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'accreditorId',
      headerName: 'Razão Social',
      flex: 1,
      minWidth: 320,
      valueGetter: (params) => params.row.accreditedCompany.corporateReason,
    },
    {
      field: 'companyId',
      headerName: 'Nome Fantasia',
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
      headerName: 'Ações',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      editable: false,
      filterable: false,
      disableExport: true,

      renderCell: (params) => (
        <div key={params.id}>
          <IconButton onClick={() => push(`accreditations/${params.row.id}`)}>
            <Tooltip title="Editar">
              <Edit />
            </Tooltip>
          </IconButton>

          <IconButton
            onClick={() =>
              openModal(async () => {
                try {
                  await accreditedService.deleteById(params.row.id)
                  await fetchAllProducts()
                  toast.success('Credenciadora excluída com sucesso.')
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
      <NavigationContainer>
        <Breadcrumb
          crumbs={[
            {
              href: '/system',
              description: 'Home',
            },
            {
              description: 'Credenciamentos',
            },
          ]}
        />
      </NavigationContainer>
      <CustomBox
        title="Credenciamentos"
        onAdd={() => push('accreditations/new')}
      >
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
