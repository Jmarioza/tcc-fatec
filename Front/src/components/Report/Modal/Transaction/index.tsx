import { useState } from 'react'
import { TransactionDTO } from '@/dtos/Transaction'
import { FileDownload } from '@mui/icons-material'
import {
  Button,
  CircularProgress,
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
import { Footer } from '@/components/Footer'
import { reportService } from '@/services/reportService'
import { SearchParams } from '@/services/transactionsService'
import { TypeUser } from '@/dtos/UserRoles'
import { useToast } from '@/hooks/useToast'

interface ModalProps {
  isOpen: boolean
  transactions: TransactionDTO[]
  onClose: () => void
  params?: SearchParams
  typeUser: TypeUser
}

type ReportType = 'ANALYTICAL' | 'CONSOLIDATED'

export function ReportModal({
  isOpen = false,
  onClose,
  transactions,
  params,
  typeUser,
}: ModalProps) {
  const [reportType, setReportType] = useState<ReportType>('ANALYTICAL')
  const [isLoading, setIsLoading] = useState(false)

  const toast = useToast()

  function handleExportXSL() {
    reportType === 'ANALYTICAL'
      ? exportMovementsReport(transactions)
      : exportSummaryReport(transactions)
  }

  async function handleExportPDF() {
    try {
      setIsLoading(true)
      if (params) {
        reportType === 'ANALYTICAL'
          ? await reportService.analyticalTransactions({
              ...params,
              typeUser,
            })
          : await reportService.consolidatedTransactions({
              ...params,
              typeUser,
            })
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
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
          <Button
            startIcon={
              isLoading ? <CircularProgress size={22} /> : <FileDownload />
            }
            variant="outlined"
            onClick={handleExportPDF}
            disabled={isLoading}
          >
            PDF
          </Button>
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
