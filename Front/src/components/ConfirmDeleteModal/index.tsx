import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

interface Props {
  open: boolean
  onConfirm: (() => void) | (() => Promise<void>)
  onCancel: () => void
  description?: string
  title?: string
}

export function DeleteConfirmationModal({ open, onConfirm, onCancel }: Props) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Confirmação de Exclusão</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Tem certeza de que deseja excluir este item?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Não
        </Button>
        <Button onClick={onConfirm} color="primary">
          Sim
        </Button>
      </DialogActions>
    </Dialog>
  )
}
