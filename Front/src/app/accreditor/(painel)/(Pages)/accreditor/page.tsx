'use client'
import { useState, useEffect } from 'react'
import { Container } from '@/components/Container'
import { CustomBox } from '@/components/CustomBox'

import { useToast } from '@/hooks/useToast'
import { Accreditor, accreditorService } from '@/services/accreditorService'
import {
  ServiceContract,
  serviceContractService,
} from '@/services/serviceContractService'
import { serviceTypeService } from '@/services/serviceTypeService'
import { Switch } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { NavigationContainer } from '@/components/NavigationContainer'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { Info } from '@/components/Info'

export default function DetailAccreditorPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [accreditor, setAccreditor] = useState<Accreditor>({} as Accreditor)
  const [contracts, setContracts] = useState<ServiceContract[]>([])

  const toast = useToast()

  async function fetchProducts() {
    try {
      setIsLoading(true)
      const data = await accreditorService.getByAuth()
      if (data) {
        const accreditorData = data[0]
        setAccreditor(accreditorData)

        const [a, b] = await Promise.all([
          serviceContractService.getByAccreditorId(accreditorData.id),
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
          <Switch checked={params.row.statusContract === 'ENABLED'} />
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
              description: 'Credenciadora',
            },
          ]}
        />
      </NavigationContainer>
      <CustomBox title="Empresa">
        <Info
          title="Razão Social"
          description={accreditor.company && accreditor.company.corporateReason}
        />
        <Info
          title="Nome Fantasia"
          description={accreditor.company && accreditor.company.name}
        />
      </CustomBox>
      <CustomBox title="Contratos">
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
