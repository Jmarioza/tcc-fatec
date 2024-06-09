import { ReportContainer } from '@/components/Report/Container'
import { ReportHeader } from '@/components/Report/Header'
import { Table } from '@/components/Report/Table'
import { TableRow } from '@/components/Report/Table/Row'
import { TableBody } from '@/components/Report/Table/Body'
import { TableCell } from '@/components/Report/Table/Cell'
import { TableHeader } from '@/components/Report/Table/Header'
import { formatCPF, hideCPF } from '@/func/formmatter'
import { Footer } from '../Footer'
import { authService } from '@/services/authService'
import { Beneficiary } from '@/services/beneficiary'
import _ from 'lodash'

interface BeneficiaryReportProps {
  beneficiaries: Beneficiary[]
}

export function BeneficiaryReport({ beneficiaries }: BeneficiaryReportProps) {
  const { typeUser } = authService.getUserAuth()

  return (
    <ReportContainer orientation="portrait">
      <ReportHeader title="Beneficiários" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell style={{ width: 20 }}>Id</TableCell>
            <TableCell style={{ width: 200 }}>Beneficiário</TableCell>
            <TableCell style={{ width: 60 }}>CPF</TableCell>
            <TableCell style={{ width: 50 }}>Documento</TableCell>
            <TableCell style={{ width: 30 }}>Unidade</TableCell>
            <TableCell style={{ width: 200 }}>Curso</TableCell>
          </TableRow>
        </TableHeader>
        <TableHeader>
          <TableBody>
            {_.orderBy(
              beneficiaries,
              ['group.tag', 'subGroup.name', 'name'],
              'asc',
            ).map((beneficiary, index) => (
              <TableRow key={beneficiary.id} color={index % 2 > 0}>
                <TableCell style={{ width: 20 }}>{beneficiary.id}</TableCell>
                <TableCell style={{ width: 200 }}>{beneficiary.name}</TableCell>
                <TableCell style={{ width: 60 }}>
                  {['ACCREDITOR', 'LIMITED_ACCREDITOR', 'SYSTEM'].includes(
                    typeUser,
                  )
                    ? formatCPF(beneficiary.cpf)
                    : hideCPF(beneficiary.cpf)}
                </TableCell>
                <TableCell style={{ width: 50 }}>
                  {beneficiary.codeRef}
                </TableCell>
                <TableCell style={{ width: 30 }}>
                  {beneficiary.group?.tag}
                </TableCell>
                <TableCell style={{ width: 200 }}>
                  {beneficiary.subGroup?.name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableHeader>
      </Table>
      <Footer />
    </ReportContainer>
  )
}
