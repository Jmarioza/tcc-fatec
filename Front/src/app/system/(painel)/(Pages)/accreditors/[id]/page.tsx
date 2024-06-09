'use client'
import { useState, useEffect } from 'react'
import { Container } from '@/components/Container'
import { CustomBox } from '@/components/CustomBox'
import { CompanyDTO } from '@/dtos/Company'
import { useConfirmationModal } from '@/hooks/useModal'
import { useToast } from '@/hooks/useToast'
import { accreditorService } from '@/services/accreditorService'
import { companyService } from '@/services/companyService'
import {
  ServiceContract,
  serviceContractService,
} from '@/services/serviceContractService'
import { serviceTypeService } from '@/services/serviceTypeService'
import { Delete, Edit } from '@mui/icons-material'
import { IconButton, Switch, Tooltip } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useRouter } from 'next/navigation'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'
import { Info } from '@/components/Info'
import { GridBox } from '@/components/GridBox'

interface Props {
  params: {
    id: number
  }
}

export default function DetailAccreditorPage({ params: { id } }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [isCanEdit, setIsCanEdit] = useState(false)
  const [company, setCompany] = useState<CompanyDTO>({} as CompanyDTO)
  const [contracts, setContracts] = useState<ServiceContract[]>([])

  const toast = useToast()
  const { openModal } = useConfirmationModal()
  const { push } = useRouter()

  async function fetchProducts() {
    try {
      setIsLoading(true)
      const data = await accreditorService.getById(id)
      if (data) {
        const [companyData] = await Promise.all([
          companyService.getById(data.companyId),
          serviceContractService.getByAccreditorId(data.id),
          serviceTypeService.getAll(),
        ])
        if (companyData) setCompany(companyData)

        const [a, b] = await Promise.all([
          serviceContractService.getByAccreditorId(id),
          serviceTypeService.getAll(),
        ])
        if (a && b) {
          setContracts(
            a.map((item) => {
              return {
                ...item,
                serviceType: b.find((i) => i.id === item.serviceId),
              }
            }),
          )
        }
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  async function handleToggleSwitch(id: number) {
    try {
      setIsLoading(true)
      const findContract = contracts.find((item) => item.id === id)
      const newStatus =
        findContract?.statusContract === 'DISABLED' ? 'ENABLED' : 'DISABLED'
      await serviceContractService.update(id, { statusContract: newStatus })
      setContracts((prevState) =>
        prevState.map((item) =>
          item.id === id
            ? {
                ...item,
                statusContract: newStatus,
              }
            : item,
        ),
      )
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Serviço Contratado',
      width: 220,
      flex: 1,
      renderCell: (params) => params.row.serviceType.name,
    },
    {
      field: 'commissionType',
      headerName: 'Tipo de Taxa',
      width: 220,
      renderCell: (params) =>
        params.row.commissionType === 'VALUE' ? 'Valor R$' : 'Percentual %',
    },
    {
      field: 'commission',
      headerName: 'Taxa Administrativa',
      width: 220,
      renderCell: (params) =>
        params.row.commissionType === 'VALUE'
          ? new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(params.row.commission)
          : new Intl.NumberFormat('pt-BR', {
              style: 'percent',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(Number(params.row.commission) / 100),
    },
    {
      field: 'maximumCharge',
      headerName: 'Cobrança Máxima',
      width: 220,
      renderCell: (params) =>
        new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(params.row.maximumCharge),
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
              checked={params.row.statusContract === 'ENABLED'}
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
          <IconButton>
            <Tooltip
              title="Editar"
              onClick={() => push(`${id}/contracts/${params.row.id}`)}
            >
              <Edit />
            </Tooltip>
          </IconButton>
          <IconButton
            onClick={() =>
              openModal(async () => {
                try {
                  await serviceContractService.deleteById(params.row.id)
                  await fetchProducts()
                  toast.success('Contrato excluído com sucesso.')
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
              href: '/system/accreditors',
              description: 'Credenciadoras',
            },
            {
              description: 'Detalhes',
            },
          ]}
        />
      </NavigationContainer>
      <CustomBox title="Empresa">
        <GridBox column={2}>
          <Info title="Razão Social" description={company.corporateReason} />
          <Info title="Nome Fantasia" description={company.name} />
        </GridBox>
      </CustomBox>
      <CustomBox
        title="Contratos"
        onToggleEdit={() => setIsCanEdit(!isCanEdit)}
        onAdd={() => push(`${id}/contracts/new`)}
      >
        <DataGrid
          rows={contracts}
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
