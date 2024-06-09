import { BeneficiaryImportDTO } from '@/dtos/ImportBeneficiaries'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'

interface Props {
  data: BeneficiaryImportDTO[]
}

export function ImportTable({ data }: Props) {
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
          {data.map((row, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{row.nome}</TableCell>
              <TableCell>{row.cpf}</TableCell>
              <TableCell>{row.matricula}</TableCell>
              <TableCell>{row.campus}</TableCell>
              <TableCell>{row.unidade}</TableCell>
              <TableCell>{row.curso}</TableCell>
              <TableCell>{row.situacao}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
