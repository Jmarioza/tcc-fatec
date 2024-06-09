'use client'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { CustomBox } from '@/components/CustomBox'
import { IconButton, Tooltip, Switch } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/useToast'
import { useConfirmationModal } from '@/hooks/useModal'
import { ServiceTypeDTO } from '@/dtos/ServiceType'
import { serviceTypeService } from '@/services/serviceTypeService'
import { Container } from '@/components/Container'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'

export default function ServiceTypePage() {
  const [servicesTypes, setServicesTypes] = useState<ServiceTypeDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCanEdit, setIsCanEdit] = useState(false)

  const { push } = useRouter()
  const toast = useToast()
  const { openModal } = useConfirmationModal()

  async function fetchAllServicesTypes() {
    try {
      setIsLoading(true)
      const data = await serviceTypeService.getAll()
      if (data) setServicesTypes(data)
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleToggleSwitch(serviceTypeId: number) {
    try {
      setIsLoading(true)
      const findServiceType = servicesTypes.find(
        (serviceType) => serviceType.id === serviceTypeId,
      )
      const newStatus =
        findServiceType?.status === 'DISABLED' ? 'ENABLED' : 'DISABLED'
      await serviceTypeService.update(serviceTypeId, { status: newStatus })
      setServicesTypes((prevState) =>
        prevState.map((serviceType) =>
          serviceType.id === serviceTypeId
            ? {
                ...serviceType,
                status: newStatus,
              }
            : serviceType,
        ),
      )
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAllServicesTypes()
  }, [])

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
          <IconButton onClick={() => push(`services/${params.row.id}`)}>
            <Tooltip title="Editar">
              <Edit />
            </Tooltip>
          </IconButton>
          <IconButton
            onClick={() =>
              openModal(async () => {
                try {
                  await serviceTypeService.deleteById(params.row.id)
                  await fetchAllServicesTypes()
                  toast.success('Tipo de Serviço excluído com sucesso.')
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
              description: 'Serviços',
            },
          ]}
        />
      </NavigationContainer>
      <CustomBox
        title="Serviços"
        onAdd={() => push('services/new')}
        onToggleEdit={() => setIsCanEdit(!isCanEdit)}
      >
        <DataGrid
          rows={servicesTypes}
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
