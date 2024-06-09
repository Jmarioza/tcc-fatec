import { Form } from '@/components/Form'
import { Button, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/hooks/useToast'
import { authService } from '@/services/authService'

const RequestTempPasswordSchema = z.object({
  email: z.string().email({ message: 'Informe um e-mail válido' }),
})

type RequestTempPassword = z.infer<typeof RequestTempPasswordSchema>

interface Props {
  nextStep: () => void
  getEmail: (email: string) => void
}

export function RequestPassword({ nextStep, getEmail }: Props) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RequestTempPassword>({
    resolver: zodResolver(RequestTempPasswordSchema),
  })

  const toast = useToast()

  async function handleSubmitForm({ email }: RequestTempPassword) {
    getEmail(email)
    try {
      const res = await authService.requestTempPassword(email)
      if (res) {
        toast.success(res.message)
        nextStep()
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  return (
    <Form onSubmit={handleSubmit(handleSubmitForm)}>
      <TextField
        required
        id="email"
        label="E-mail"
        autoComplete="email"
        autoFocus
        {...register('email')}
        error={!!errors.email?.message}
        helperText={errors.email?.message}
        sx={{ mt: 4 }}
      />
      <Button variant="contained" type="submit">
        Enviar senha por E-mail
      </Button>
    </Form>
  )
}
