'use client'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { CustomBox } from '@/components/CustomBox'
import { Tooltip, Switch } from '@mui/material'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/useToast'
import { Container } from '@/components/Container'
import { ServiceTypeDTO } from '@/dtos/ServiceType'
import { serviceTypeService } from '@/services/serviceTypeService'
import { AccreditorDTO } from '@/dtos/Accreditor'
import { accreditorService } from '@/services/accreditorService'
import { ServiceContractDTO } from '@/dtos/ServiceContracts'
import { serviceContractService } from '@/services/serviceContractService'

export default function SubGroupScreen() {
  const [services, setServices] = useState<ServiceTypeDTO[]>([])
  const [accreditors, setAccreditors] = useState<AccreditorDTO[]>([])
  const [contracts, setContracts] = useState<ServiceContractDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const toast = useToast()

  async function fetchInfo() {
    try {
      setIsLoading(true)
      const [serviceData, accreditorsData, contractsData] = await Promise.all([
        serviceTypeService.getAll(),
        accreditorService.getAll(),
        serviceContractService.getAll(),
      ])
      setServices(serviceData || [])
      setAccreditors(accreditorsData || [])
      setContracts(contractsData || [])
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInfo()
  }, [])

  function findContract(accreditorId: number, serviceId: number) {
    const accreditorContract = contracts.filter(
      (item) => item.accreditorId === accreditorId,
    )
    return accreditorContract.find((item) => item.serviceId === serviceId)
  }

  async function createOrUpdateContract(
    accreditorId: number,
    serviceId: number,
  ) {
    try {
      const hasContract = findContract(accreditorId, serviceId)
      if (!hasContract) {
        await serviceContractService.create({
          accreditorId,
          serviceId,
          statusContract: 'ENABLED',
        })
      } else {
        await serviceContractService.update(hasContract.id, {
          statusContract:
            hasContract.statusContract === 'ENABLED' ? 'DISABLED' : 'ENABLED',
        })
      }
      toast.success('Modificado com sucesso.')
      await fetchInfo()
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  const isAvailable = (accreditorId: number, serviceId: number) =>
    findContract(accreditorId, serviceId)?.statusContract === 'ENABLED'

  const columns: GridColDef[] = services.map((item) => ({
    field: item.id.toString(),
    headerName: item.name,
    minWidth: 180,
    renderCell: (params) => (
      <Tooltip
        title={
          isAvailable(Number(params.id), Number(params.field))
            ? 'Ativar'
            : 'Desativar'
        }
      >
        <Switch
          checked={isAvailable(Number(params.id), Number(params.field))}
          onChange={() =>
            createOrUpdateContract(Number(params.id), Number(params.field))
          }
        />
      </Tooltip>
    ),
  }))

  columns.unshift({
    field: 'name',
    headerName: 'Credenciador',
    minWidth: 260,
  })

  return (
    <Container>
      <CustomBox title="Contratos">
        <DataGrid
          rows={accreditors}
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
