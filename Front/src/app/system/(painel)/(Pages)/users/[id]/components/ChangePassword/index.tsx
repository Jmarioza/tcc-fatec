import { CustomBox } from '@/components/CustomBox'
import { PasswordForm, PasswordSchema } from '@/schemas/Password'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/Form'
import { Button, TextField } from '@mui/material'
import { useToast } from '@/hooks/useToast'
import { userService } from '@/services/userService'
import { GridBox } from '@/components/GridBox'
import { Footer } from '@/components/Footer'

interface Props {
  userId: number
}

export function ChangePassword({ userId }: Props) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<PasswordForm>({
    resolver: zodResolver(PasswordSchema),
  })

  const toast = useToast()

  async function handleChangePassword({ password }: PasswordForm) {
    try {
      await userService.update(userId, {
        password,
      })
      toast.success('Senha modificada com sucesso.')
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  return (
    <Form onSubmit={handleSubmit(handleChangePassword)}>
      <CustomBox title="Alterar senha">
        <GridBox>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '1rem',
              width: '100%',
            }}
          >
            <TextField
              label="Senha"
              type="password"
              required
              size="small"
              sx={{ width: '100%' }}
              error={!!errors.password?.message}
              helperText={errors.password?.message}
              {...register('password')}
            />
            <TextField
              label="Repita a senha"
              type="password"
              required
              size="small"
              sx={{ width: '100%' }}
              error={!!errors?.confirm?.message}
              helperText={errors?.confirm?.message}
              {...register('confirm')}
            />
          </div>
        </GridBox>
        <Footer>
          <Button type="submit" variant="contained">
            Alterar senha
          </Button>
        </Footer>
      </CustomBox>
    </Form>
  )
}
