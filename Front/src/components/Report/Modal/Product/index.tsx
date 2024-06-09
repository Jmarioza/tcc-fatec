import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { useToast } from '@/hooks/useToast'
import { reportService } from '@/services/reportService'
import { useAccreditor } from '@/hooks/useAccreditor'
import { FileDownload } from '@mui/icons-material'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ReportModal({ isOpen = false, onClose }: ModalProps) {
  const toast = useToast()
  const { accreditor } = useAccreditor()

  async function handleReport() {
    try {
      await reportService.productsReport({
        accreditorId: accreditor.id,
      })
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Exportar Relatório</DialogTitle>
      <DialogContent>
        <DialogActions>
          <Button startIcon={<FileDownload />} onClick={handleReport}>
            Baixar PDF
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
