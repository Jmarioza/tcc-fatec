'use client'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { CustomBox } from '@/components/CustomBox'
import { IconButton, Tooltip, Switch } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/useToast'
import { useConfirmationModal } from '@/hooks/useModal'
import { beneficiarySubGroupService } from '@/services/beneficiarySubGroupService'
import { Container } from '@/components/Container'
import { BeneficiarySubGroupDTO } from '@/dtos/BeneficiarySubGroup'

interface Props {
  groupId: number
}

export function SubGroupScreen({ groupId }: Props) {
  const [subGroups, setSubGroups] = useState<BeneficiarySubGroupDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCanEdit, setIsCanEdit] = useState(false)

  const { push } = useRouter()
  const toast = useToast()
  const { openModal } = useConfirmationModal()

  async function fetchAllSubGroups() {
    try {
      setIsLoading(true)
      const data = await beneficiarySubGroupService.getByGroupId(groupId)
      if (data) setSubGroups(data)
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleToggleSwitch(subGroupId: number) {
    try {
      setIsLoading(true)
      const findSubGroup = subGroups.find(
        (subGroup) => subGroup.id === subGroupId,
      )
      const newStatus =
        findSubGroup?.status === 'DISABLED' ? 'ENABLED' : 'DISABLED'
      await beneficiarySubGroupService.update(subGroupId, { status: newStatus })
      setSubGroups((prevState) =>
        prevState.map((subGroup) =>
          subGroup.id === subGroupId
            ? {
                ...subGroup,
                status: newStatus,
              }
            : subGroup,
        ),
      )
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAllSubGroups()
  }, [])

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Subgrupo', flex: 1, minWidth: 320 },
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
          <IconButton
            onClick={() => push(`${groupId}/subgroups/${params.row.id}`)}
          >
            <Tooltip title="Editar">
              <Edit />
            </Tooltip>
          </IconButton>
          <IconButton
            onClick={() =>
              openModal(async () => {
                try {
                  await beneficiarySubGroupService.deleteById(params.row.id)
                  await fetchAllSubGroups()
                  toast.success('Subgrupo excluído com sucesso.')
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
      <CustomBox
        title="Subgrupos"
        onAdd={() => push(`${groupId}/subgroups/new`)}
        onToggleEdit={() => setIsCanEdit(!isCanEdit)}
      >
        <DataGrid
          rows={subGroups}
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
