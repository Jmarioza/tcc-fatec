import { Form } from '@/components/Form'
import { Button, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/hooks/useToast'
import { authService } from '@/services/authService'
import { PasswordSchema } from '@/schemas/Password'

const RequestTempPasswordSchema = z.object({
  password: PasswordSchema,
  tempPassword: z
    .string()
    .min(6, { message: 'Informe o a senha recebida pelo e-mail' }),
})

type RequestTempPassword = z.infer<typeof RequestTempPasswordSchema>

interface Props {
  nextStep: () => void
  email: string
}

export function ChangePassword({ nextStep, email }: Props) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RequestTempPassword>({
    resolver: zodResolver(RequestTempPasswordSchema),
  })

  const toast = useToast()

  async function handleSubmitForm({
    password,
    tempPassword,
  }: RequestTempPassword) {
    try {
      const res = await authService.newPassword({
        username: email,
        newPassword: password.password,
        tempPassword,
      })
      if (res) {
        toast.success(res.message)
        return nextStep()
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  return (
    <Form onSubmit={handleSubmit(handleSubmitForm)}>
      <TextField
        label="Código de Verificação"
        required
        fullWidth
        autoFocus
        {...register('tempPassword')}
        error={!!errors.tempPassword}
        helperText={errors.tempPassword?.message}
        sx={{ mt: 4 }}
      />
      <TextField
        label="Nova senha"
        required
        fullWidth
        type="password"
        {...register('password.password')}
        error={!!errors.password?.password}
        helperText={errors.password?.password?.message}
      />
      <TextField
        label="Confirme a senha"
        required
        fullWidth
        type="password"
        {...register('password.confirm')}
        error={!!errors.password?.confirm}
        helperText={errors.password?.confirm?.message}
      />
      <Button variant="contained" type="submit">
        Redefinir senha
      </Button>
    </Form>
  )
}
