import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { Footer } from '@/components/Footer'
import { ButtonReport } from '@/components/Report/ButtonReport'
import { Beneficiary } from '@/services/beneficiary'
import { BeneficiaryReport } from '@/components/Report/Reports/BeneficiaryReport'

interface ModalProps {
  isOpen: boolean
  beneficiaries: Beneficiary[]
  onClose: () => void
}

export function ReportModal({
  isOpen = false,
  onClose,
  beneficiaries,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Exportar Relatório</DialogTitle>
      <DialogContent>
        <DialogActions>
          <Footer>
            <ButtonReport
              fileName="Beneficiários"
              document={<BeneficiaryReport beneficiaries={beneficiaries} />}
            />
          </Footer>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
