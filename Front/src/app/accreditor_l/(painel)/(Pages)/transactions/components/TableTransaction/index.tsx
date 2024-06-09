import { TransactionDTO } from '@/dtos/Transaction'
import { Check, Clear } from '@mui/icons-material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Menu } from '../Menu'
import { useRouter } from 'next/navigation'
import { formatCPF } from '@/func/formmatter'

interface Props {
  transactions: TransactionDTO[]
  isLoading?: boolean
}

export function TableTransaction({ transactions, isLoading }: Props) {
  const { push } = useRouter()

  const columns: GridColDef[] = [
    {
      disableExport: true,
      disableColumnMenu: true,
      disableReorder: true,
      sortable: false,
      editable: false,
      filterable: false,
      field: 'menu',
      align: 'center',
      headerName: ' ',
      width: 40,
      renderCell: (params) => (
        <Menu onClick={() => push(`transactions/${params.row.id}`)} />
      ),
    },
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
    },
    {
      field: 'statusTransaction',
      headerName: 'OK',
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
      headerName: 'Dt. Transação',
      headerAlign: 'center',
      align: 'center',
      width: 140,
      valueGetter: (params) =>
        new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
          timeStyle: 'short',
        }).format(new Date(params.row.dateTime)),
    },
    {
      field: 'accredited',
      headerName: 'Credenciado',
      width: 220,
      valueGetter: (params) => params.row.accredited.company.name,
    },
    {
      field: 'localTransactionReference',
      headerName: 'Referência',
      width: 260,
    },

    {
      field: 'localTransactionPoint',
      headerName: 'Ponto de Venda',
      width: 120,
    },
    {
      field: 'beneficiaryCPF',
      headerName: 'CPF',
      width: 130,
      valueGetter: (params) => formatCPF(params.row.beneficiary.cpf),
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
      minWidth: 280,
      valueGetter(params) {
        return params.row.product.name
      },
    },
    {
      field: 'group',
      headerName: 'Grupo do Produto',
      flex: 1,
      minWidth: 120,
      valueGetter(params) {
        return params.row.productGroup.name
      },
    },
    {
      field: 'quantity',
      headerName: 'Qtd',
      headerAlign: 'center',
      align: 'right',
      width: 50,
    },

    {
      field: 'valueProduct',
      headerName: 'Vl. Produto',
      minWidth: 130,
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
      minWidth: 140,
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
      minWidth: 130,
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
    <DataGrid
      rows={transactions}
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
  )
}
