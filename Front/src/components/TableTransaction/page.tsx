import { TransactionDTO } from '@/dtos/Transaction'
import { Check, Clear } from '@mui/icons-material'
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from '@mui/x-data-grid'

interface Props {
  transactions: TransactionDTO[]
  isLoading?: boolean
}

export function TableTransaction({ transactions, isLoading }: Props) {
  function GridBar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport
          csvOptions={{
            delimiter: ';',
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    )
  }

  const columns: GridColDef[] = [
    {
      field: 'statusTransaction',
      headerName: ' ',
      filterable: false,
      width: 40,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) =>
        params.row.statusTransaction === 'OK' ? (
          <Check color="success" />
        ) : (
          <Clear color="error" />
        ),
    },

    {
      field: 'dateTime',
      headerName: 'Data da Transação',
      width: 140,
      valueGetter: (params) =>
        new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
          timeStyle: 'short',
        }).format(new Date(params.row.dateTime)),
    },

    {
      field: 'localTransactionPoint',
      headerName: 'Ponto de Venda',
      width: 140,
    },

    {
      field: 'beneficiary',
      headerName: 'Beneficiário',
      width: 220,
      valueGetter: (params) => params.row.beneficiary.name,
    },

    {
      field: 'product',
      headerName: 'Produto',
      minWidth: 240,
      valueGetter(params) {
        return params.row.product.name
      },
    },
    {
      field: 'group',
      headerName: 'Grupo do Produto',
      flex: 1,
      minWidth: 240,
      valueGetter(params) {
        return params.row.productGroup.name
      },
    },
    {
      field: 'quantity',
      headerAlign: 'center',
      headerName: 'Qtd',
      align: 'center',
    },

    {
      field: 'valueProduct',
      headerName: 'Vl. Produto',
      minWidth: 120,
      headerAlign: 'center',
      align: 'right',
      valueGetter(params) {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(params.row.valueProduct)
      },
    },
    {
      field: 'valueCoparticipation',
      headerName: 'Vl. Coparticipação',
      minWidth: 120,
      align: 'right',
      headerAlign: 'center',
      valueGetter(params) {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(params.row.valueCoparticipation)
      },
    },

    {
      field: 'commission',
      headerName: 'Taxa Adm',
      minWidth: 120,
      headerAlign: 'center',
      align: 'right',
      valueGetter: (params) =>
        new Intl.NumberFormat('pt-BT', {
          currency: 'BRL',
          style: 'currency',
        }).format(params.row.commission),
    },
  ]

  return (
    <>
      <DataGrid
        rows={transactions}
        slots={{ toolbar: GridBar }}
        columns={columns}
        pageSizeOptions={[5, 50]}
        loading={isLoading}
        density="compact"
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 50 },
          },
        }}
      />
    </>
  )
}
