import { useState, useEffect } from 'react'
import { CustomBox } from '@/components/CustomBox'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { TransactionOccurrenceDTO } from '@/dtos/TransactionOccurrence'
import { transactionOccurrenceService } from '@/services/transactionOccurrenceService'
import { useToast } from '@/hooks/useToast'

const columns: GridColDef[] = [
  {
    field: 'date',
    headerName: 'Data e Hora',
    width: 140,
    valueGetter: (params) =>
      new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date(params.row.dateTime)),
  },
  { field: 'occurrence', headerName: 'Ocorrência', flex: 1 },
  { field: 'reason', headerName: 'Motivo', flex: 1 },
]

interface Props {
  transactionId?: number
}

export function TransactionOccurrence({ transactionId }: Props) {
  const [occurrences, setOccurrences] = useState<TransactionOccurrenceDTO[]>([])

  const toast = useToast()

  useEffect(() => {
    if (transactionId) {
      ;(async function () {
        try {
          const data =
            await transactionOccurrenceService.getByTransactionId(transactionId)
          setOccurrences(data || [])
        } catch (error) {
          if (error instanceof Error) toast.error(error.message)
        }
      })()
    }
  }, [transactionId])

  return (
    <CustomBox title="Ocorrências">
      <DataGrid
        rows={occurrences}
        columns={columns}
        pageSizeOptions={[5, 50]}
        density="compact"
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
      />
    </CustomBox>
  )
}
