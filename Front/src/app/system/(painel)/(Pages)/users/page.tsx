'use client'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { CustomBox } from '@/components/CustomBox'
import { IconButton, Tooltip, Switch } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { UserDTO } from '@/dtos/User'
import { userService } from '@/services/userService'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/useToast'
import { useConfirmationModal } from '@/hooks/useModal'
import { Container } from '@/components/Container'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'

export default function UsersPage() {
  const [users, setUsers] = useState<UserDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCanEdit, setIsCanEdit] = useState(false)

  const toast = useToast()
  const { push } = useRouter()
  const { openModal } = useConfirmationModal()

  async function fetchAllUsers() {
    try {
      setIsLoading(true)
      const data = await userService.getAll()
      if (data) setUsers(data)
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleToggleSwitch(userId: number) {
    try {
      setIsLoading(true)
      const findUser = users.find((user) => user.id === userId)
      const newStatus = findUser?.status === 'DISABLED' ? 'ENABLED' : 'DISABLED'
      await userService.update(userId, { status: newStatus })
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                status: newStatus,
              }
            : user,
        ),
      )
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAllUsers()
  }, [])

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nome Completo', flex: 1, minWidth: 320 },
    { field: 'username', headerName: 'Email', width: 260 },
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
          <IconButton onClick={() => push(`users/${params.row.id}`)}>
            <Tooltip title="Editar">
              <Edit />
            </Tooltip>
          </IconButton>
          <IconButton
            onClick={() =>
              openModal(async () => {
                try {
                  await userService.deleteById(params.row.id)
                  await fetchAllUsers()
                  toast.success('Usuário excluído com sucesso.')
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
              description: 'Usuários',
            },
          ]}
        />
      </NavigationContainer>
      <CustomBox
        title="Usuários"
        onAdd={() => push('users/new')}
        onToggleEdit={() => setIsCanEdit(!isCanEdit)}
      >
        <DataGrid
          rows={users}
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
