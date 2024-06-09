import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '../Form'
import { useToast } from '@/hooks/useToast'
import { transactionsService } from '@/services/transactionsService'
import { z } from 'zod'

interface Props {
  isOpen: boolean
  handleClose: () => void
  actionType: 'RESTORE' | 'CANCEL'
  transactionId: number
}

const ConfirmSchema = z.object({
  reason: z
    .string()
    .min(10, { message: 'Motivo deve ter mais que 10 caracteres.' }),
})

type ConfirmForm = z.infer<typeof ConfirmSchema>

export function ReasonModal({
  isOpen,
  handleClose,
  actionType,
  transactionId,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmForm>({
    resolver: zodResolver(ConfirmSchema),
  })

  const toast = useToast()

  async function handleCancelTransaction({ reason }: ConfirmForm) {
    try {
      await transactionsService.changeStatus({
        status: actionType === 'RESTORE' ? 'OK' : 'CANCELED',
        transactionId,
        reason,
      })
      toast.success(
        actionType === 'RESTORE'
          ? 'Transação restaurada com sucesso.'
          : 'Transação cancelada com sucesso.',
      )
      handleClose()
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <Form onSubmit={handleSubmit(handleCancelTransaction)}>
        <DialogTitle>
          {actionType === 'RESTORE' ? 'Restaurar' : 'Cancelar'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: '1rem' }}>
            {actionType === 'RESTORE'
              ? 'Por favor, informe o motivo para restaurar esta transação.'
              : 'Por favor, informe o motivo do cancelamento da transação.'}
          </DialogContentText>
          <TextField
            label="Motivo"
            fullWidth
            error={!!errors.reason?.message}
            helperText={errors.reason?.message}
            {...register('reason')}
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  )
}
