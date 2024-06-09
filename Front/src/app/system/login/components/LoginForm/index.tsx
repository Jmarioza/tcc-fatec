import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useForm } from 'react-hook-form'
import { AuthenticateProps } from '@/services/authService'
import { Form } from '@/components/Form'
import { useState } from 'react'
import { CircularProgress } from '@mui/material'

interface Props {
  authenticate: (user: AuthenticateProps) => Promise<void>
}

export function LoginForm({ authenticate }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AuthenticateProps>()

  async function handleSubmitForm(user: AuthenticateProps) {
    setIsLoading(true)
    try {
      await authenticate(user)
    } catch (error) {
      if (error instanceof Error) {
        setError('email', { message: error.message })
        setError('password', { message: error.message })
      }
    }
    setIsLoading(false)
  }

  return (
    <Form onSubmit={handleSubmit(handleSubmitForm)}>
      <TextField
        required
        id="email"
        label="E-mail"
        fullWidth
        autoComplete="email"
        autoFocus
        error={!!errors.email?.message}
        helperText={errors.email?.message}
        {...register('email')}
      />
      <TextField
        required
        label="Senha"
        type="password"
        id="password"
        fullWidth
        autoComplete="current-password"
        error={!!errors.password?.message}
        helperText={errors.password?.message}
        {...register('password')}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}
      >
        {!isLoading ? 'Entrar' : <CircularProgress />}
      </Button>
    </Form>
  )
}
