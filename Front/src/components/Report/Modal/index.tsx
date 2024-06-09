import { useState } from 'react'
import { TransactionDTO } from '@/dtos/Transaction'
import { FileDownload } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material'
import { exportReport as exportMovementsReport } from '@/services/report/TransactionAnalyticalReport'
import { exportReport as exportSummaryReport } from '@/services/report/TransactionGroupedReport'
import { ButtonReport } from '../ButtonReport'
import { TransactionAnalyticalReport } from '../Reports/TransactionAnalyticalReport'
import { TransactionConsolidatedReport } from '../Reports/TransactionConsolidatedReport'
import { Footer } from '@/components/Footer'

interface ModalProps {
  isOpen: boolean
  transactions: TransactionDTO[]
  onClose: () => void
  dateStart: string
  dateEnd: string
}

type ReportType = 'ANALYTICAL' | 'CONSOLIDATED'

export function ReportModal({
  isOpen = false,
  onClose,
  transactions,
  dateStart,
  dateEnd,
}: ModalProps) {
  const [reportType, setReportType] = useState<ReportType>('ANALYTICAL')

  function handleExportXSL() {
    reportType === 'ANALYTICAL'
      ? exportMovementsReport(transactions)
      : exportSummaryReport(transactions)
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Exportar Relatório</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Selecione o tipo de relatorio desejado:
        </DialogContentText>
        <RadioGroup
          row
          value={reportType}
          onChange={(e) => setReportType(e.target.value as ReportType)}
        >
          <FormControlLabel
            value="ANALYTICAL"
            control={<Radio />}
            label="Analítico"
          />
          <FormControlLabel
            value="CONSOLIDATED"
            control={<Radio />}
            label="Consolidado"
          />
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Footer>
          <ButtonReport
            fileName={
              reportType === 'ANALYTICAL'
                ? 'Analítico_de_transacoes.pdf'
                : 'Consolidado_de_transacoes.pdf'
            }
            document={
              reportType === 'ANALYTICAL' ? (
                <TransactionAnalyticalReport
                  dateEnd={dateEnd}
                  dateStart={dateStart}
                  transactions={transactions}
                />
              ) : (
                <TransactionConsolidatedReport
                  dateEnd={dateEnd}
                  dateStart={dateStart}
                  transactions={transactions}
                />
              )
            }
          />
          <Button
            startIcon={<FileDownload />}
            variant="outlined"
            onClick={handleExportXSL}
          >
            XSL
          </Button>
        </Footer>
      </DialogActions>
    </Dialog>
  )
}
