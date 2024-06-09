'use client'
import { useEffect, useState } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { CustomBox } from '@/components/CustomBox'
import { IconButton, Tooltip, Switch, Button } from '@mui/material'
import { Edit, Delete, FileDownload } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/useToast'
import { useConfirmationModal } from '@/hooks/useModal'
import { BeneficiaryGroupDTO } from '@/dtos/BeneficiaryGroup'
import { beneficiaryGroupService } from '@/services/beneficiaryGroupService'
import { Container } from '@/components/Container'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'
import { useAccreditor } from '@/hooks/useAccreditor'
import { ReportModal } from '@/components/Report/Modal/BeneficiaryGroup'

export default function GroupScreen() {
  const [groups, setGroups] = useState<BeneficiaryGroupDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCanEdit, setIsCanEdit] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)

  const { push } = useRouter()
  const toast = useToast()
  const { openModal } = useConfirmationModal()
  const { accreditor } = useAccreditor()

  async function fetchGroups() {
    try {
      setIsLoading(true)
      const data = await beneficiaryGroupService.getByUser({
        accreditorId: accreditor.id,
      })
      setGroups(data || [])
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleToggleSwitch(groupId: number) {
    try {
      setIsLoading(true)
      const findGroup = groups.find((group) => group.id === groupId)
      const newStatus =
        findGroup?.status === 'DISABLED' ? 'ENABLED' : 'DISABLED'
      await beneficiaryGroupService.update(groupId, { status: newStatus })
      setGroups((prevState) =>
        prevState.map((group) =>
          group.id === groupId
            ? {
                ...group,
                status: newStatus,
              }
            : group,
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
      fetchGroups()
    }
  }, [accreditor])

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Descrição', flex: 1, minWidth: 320 },
    { field: 'tag', headerName: 'Tag', width: 180 },
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
          <IconButton onClick={() => push(`groups/${params.row.id}`)}>
            <Tooltip title="Editar">
              <Edit />
            </Tooltip>
          </IconButton>
          <IconButton
            onClick={() =>
              openModal(async () => {
                try {
                  await beneficiaryGroupService.deleteById(params.row.id)
                  await fetchGroups()
                  toast.success('Grupo excluído com sucesso.')
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
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(!reportModalOpen)}
      />
      <NavigationContainer>
        <Breadcrumb
          crumbs={[
            {
              href: '/accreditor_l',
              description: 'Home',
            },
            {
              description: 'Grupos',
            },
          ]}
        />
      </NavigationContainer>

      <CustomBox
        title="Grupos"
        onAdd={() => push('groups/new')}
        onToggleEdit={() => setIsCanEdit(!isCanEdit)}
        customHeader={
          <Button
            startIcon={<FileDownload />}
            onClick={() => setReportModalOpen(!reportModalOpen)}
          >
            Exportar
          </Button>
        }
      >
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
