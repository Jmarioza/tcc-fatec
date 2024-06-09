'use client'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { CustomBox } from '@/components/CustomBox'
import { IconButton, Switch, Tooltip } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Accreditor, accreditorService } from '@/services/accreditorService'
import { useToast } from '@/hooks/useToast'
import { useConfirmationModal } from '@/hooks/useModal'
import { companyService } from '@/services/companyService'
import { Container } from '@/components/Container'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'

export default function AccreditorPage() {
  const [accreditors, setAccreditors] = useState<Accreditor[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCanEdit, setIsCanEdit] = useState(false)

  const { push } = useRouter()
  const toast = useToast()
  const { openModal } = useConfirmationModal()

  async function handleToggleSwitch(userId: number) {
    try {
      setIsLoading(true)
      const findUser = accreditors.find((user) => user.id === userId)
      const newStatus = findUser?.status === 'DISABLED' ? 'ENABLED' : 'DISABLED'
      await accreditorService.update(userId, { status: newStatus })
      setAccreditors((prevUsers) =>
        prevUsers.map((accreditor) =>
          accreditor.id === userId
            ? {
                ...accreditor,
                status: newStatus,
              }
            : accreditor,
        ),
      )
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchAllAccreditors() {
    try {
      setIsLoading(true)
      const [companiesData, accreditorsData] = await Promise.all([
        companyService.getAll(),
        accreditorService.getAll(),
      ])
      if (accreditorsData && companiesData) {
        const accreditorsWithCompany: Accreditor[] = accreditorsData.map(
          (item) => {
            return {
              ...item,
              company: companiesData.find(
                (company) => company.id === item.companyId,
              ),
            }
          },
        )
        setAccreditors(accreditorsWithCompany)
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAllAccreditors()
  }, [])

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'corporateReason',
      headerName: 'Razão Social',
      flex: 1,
      valueGetter: (params) => params.row.company.corporateReason,
    },
    {
      field: 'name',
      headerName: 'Nome Fantasia',
      flex: 1,
      valueGetter: (params) => params.row.company.name,
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
          <IconButton onClick={() => push(`accreditors/${params.row.id}`)}>
            <Tooltip title="Editar">
              <Edit />
            </Tooltip>
          </IconButton>
          <IconButton
            onClick={() =>
              openModal(async () => {
                try {
                  await accreditorService.deleteById(params.row.id)
                  await fetchAllAccreditors()
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
              description: 'Credenciadoras',
            },
          ]}
        />
      </NavigationContainer>
      <CustomBox
        title="Credenciadoras"
        onAdd={() => push('accreditors/new')}
        onToggleEdit={() => setIsCanEdit(!isCanEdit)}
      >
        <DataGrid
          rows={accreditors}
          columns={columns}
          pageSizeOptions={[5, 50]}
          loading={isLoading}
          density="compact"
        />
      </CustomBox>
    </Container>
  )
}
