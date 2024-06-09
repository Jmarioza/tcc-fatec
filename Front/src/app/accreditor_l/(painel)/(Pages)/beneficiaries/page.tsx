'use client'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { CustomBox } from '@/components/CustomBox'
import { IconButton, Tooltip, Switch, Button } from '@mui/material'
import { Edit, Delete, FileDownload } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/useToast'
import { useConfirmationModal } from '@/hooks/useModal'
import { Beneficiary, beneficiaryService } from '@/services/beneficiary'
import { Container } from '@/components/Container'
import { formatCPF } from '@/func/formmatter'
import { beneficiaryGroupService } from '@/services/beneficiaryGroupService'
import { beneficiarySubGroupService } from '@/services/beneficiarySubGroupService'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'
import { useAccreditor } from '@/hooks/useAccreditor'
import { userAccreditorBeneficiaryGroupService } from '@/services/userAccreditorBeneficiaryGroupService'
import { authService } from '@/services/authService'
import { ReportModal } from '@/components/Report/Modal/Beneficiary'

export default function BeneficiaryScreen() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCanEdit, setIsCanEdit] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  const { push } = useRouter()
  const toast = useToast()
  const { openModal } = useConfirmationModal()
  const { accreditor } = useAccreditor()

  async function handleToggleSwitch(beneficiaryId: number) {
    try {
      setIsLoading(true)
      const findBeneficiary = beneficiaries.find(
        (beneficiary) => beneficiary.id === beneficiaryId,
      )
      const newStatus =
        findBeneficiary?.status === 'DISABLED' ? 'ENABLED' : 'DISABLED'
      await beneficiaryService.update(beneficiaryId, { status: newStatus })
      setBeneficiaries((prevUsers) =>
        prevUsers.map((beneficiary) =>
          beneficiary.id === beneficiaryId
            ? {
                ...beneficiary,
                status: newStatus,
              }
            : beneficiary,
        ),
      )
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchBeneficiaries() {
    try {
      const { userId } = authService.getUserAuth()

      const [groupData, subGroupData, userBenGroupsData] = await Promise.all([
        beneficiaryGroupService.getAll(),
        beneficiarySubGroupService.getAll(),
        userAccreditorBeneficiaryGroupService.get({
          accreditorId: accreditor.id,
          userId,
        }),
      ])

      const beneficiariesData = await beneficiaryService.getByAccreditorId(
        accreditor.id,
      )
      if (beneficiariesData && groupData && subGroupData) {
        const beneficiariesWithRelations: Beneficiary[] = beneficiariesData.map(
          (item) => {
            return {
              ...item,
              group: groupData.find((gp) => gp.id === item.beneficiaryGroupId),
              subGroup: subGroupData.find(
                (gp) => gp.id === item.beneficiarySubgroupId,
              ),
            }
          },
        )

        if (userBenGroupsData) {
          setBeneficiaries(
            beneficiariesWithRelations.filter((beneficiary) =>
              userBenGroupsData.find(
                (item) =>
                  item.beneficiaryGroupId === beneficiary.beneficiaryGroupId,
              ),
            ),
          )
        }
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  useEffect(() => {
    if (accreditor.id) {
      fetchBeneficiaries()
    }
  }, [accreditor])

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nome Completo', flex: 1, minWidth: 320 },
    {
      field: 'cpf',
      headerName: 'CPF',
      width: 140,
      valueGetter: (params) => formatCPF(params.row.cpf),
    },
    { field: 'codeRef', headerName: 'Documento', width: 120 },
    {
      field: 'beneficiaryGroupId',
      headerName: 'Grupo',
      width: 120,
      valueGetter: (params) => params.row.group.name,
    },
    {
      field: 'beneficiarySubgroupId',
      headerName: 'Subgrupo',
      minWidth: 260,
      valueGetter: (params) => params.row.subGroup.name,
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
          <IconButton onClick={() => push(`beneficiaries/${params.row.id}`)}>
            <Tooltip title="Editar">
              <Edit />
            </Tooltip>
          </IconButton>
          <IconButton
            onClick={() =>
              openModal(async () => {
                try {
                  await beneficiaryService.deleteById(params.row.id)
                  await fetchBeneficiaries()
                  toast.success('Beneficiário excluído com sucesso.')
                } catch (error) {
                  if (error instanceof Error) toast.error(error.message)
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
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(!isReportModalOpen)}
      />
      <NavigationContainer>
        <Breadcrumb
          crumbs={[
            {
              href: '/accreditor_l',
              description: 'Home',
            },
            {
              description: 'Beneficiários',
            },
          ]}
        />
      </NavigationContainer>
      <CustomBox
        title="Beneficiários"
        onAdd={() => push('beneficiaries/new')}
        onToggleEdit={() => setIsCanEdit(!isCanEdit)}
        customHeader={
          <Button
            startIcon={<FileDownload />}
            onClick={() => setIsReportModalOpen(!isReportModalOpen)}
          >
            Exportar
          </Button>
        }
      >
        <DataGrid
          rows={beneficiaries}
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
