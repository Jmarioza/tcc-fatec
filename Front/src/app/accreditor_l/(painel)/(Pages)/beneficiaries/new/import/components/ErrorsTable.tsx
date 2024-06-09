import { BeneficiaryErrors } from '@/dtos/ImportBeneficiaries'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'

interface Props {
  data?: BeneficiaryErrors[]
}

export function ErrorsTable({ data }: Props) {
  return (
    <TableContainer sx={{ minWidth: 400 }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nome Completo</TableCell>
            <TableCell>CPF</TableCell>
            <TableCell>Matricula</TableCell>
            <TableCell>Campus</TableCell>
            <TableCell>Unidade</TableCell>
            <TableCell>Curso</TableCell>
            <TableCell>Situação</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row, index) => (
            <>
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{row.beneficiaryData.nome}</TableCell>
                <TableCell>{row.beneficiaryData.cpf}</TableCell>
                <TableCell>{row.beneficiaryData.matricula}</TableCell>
                <TableCell>{row.beneficiaryData.campus}</TableCell>
                <TableCell>{row.beneficiaryData.unidade}</TableCell>
                <TableCell>{row.beneficiaryData.curso}</TableCell>
                <TableCell>{row.beneficiaryData.situacao}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={7}>
                  <ul>
                    {row.errors.map((item) => (
                      <li key={`${row.beneficiaryData.cpf}-${item}`}>{item}</li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
