'use client'
import { useState, useEffect } from 'react'
import { Container } from '@/components/Container'
import { CustomBox } from '@/components/CustomBox'
import { UserDTO } from '@/dtos/User'
import { useToast } from '@/hooks/useToast'
import { userService } from '@/services/userService'
import { authService } from '@/services/authService'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PasswordForm, PasswordSchema } from '@/schemas/Password'
import { Form } from '@/components/Form'
import { Button, TextField } from '@mui/material'
import { GridBox } from '@/components/GridBox'
import { Footer } from '@/components/Footer'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'
import { Info } from '@/components/Info'

export default function UserPage() {
  const [user, setUser] = useState<UserDTO | undefined>(undefined)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(PasswordSchema),
  })

  const toast = useToast()

  useEffect(() => {
    ;(async function () {
      try {
        const { userId } = authService.getUserAuth()
        const data = await userService.getById(userId)
        setUser(data)
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    })()
  }, [])

  async function handleChangePassword(password: PasswordForm) {
    try {
      if (user) {
        await userService.update(user.id, { password: password.password })
        toast.success('Senha alterada com sucesso.')
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  return (
    <Container>
      <NavigationContainer>
        <Breadcrumb
          crumbs={[
            {
              href: '/accreditor_l',
              description: 'Home',
            },
            {
              description: 'Eu',
            },
          ]}
        />
      </NavigationContainer>
      <CustomBox title="Usuário">
        <GridBox>
          <Info title="Nome" description={user?.name} />
          <Info title="E-mail" description={user?.username} />
        </GridBox>
      </CustomBox>
      <CustomBox title="Alterar senha">
        <Form onSubmit={handleSubmit(handleChangePassword)}>
          <GridBox>
            <TextField
              label="Nova senha"
              {...register('password')}
              size="small"
              type="password"
              error={!!errors.password?.message}
              helperText={errors.password?.message}
            />
            <TextField
              label="Confirme a senha"
              {...register('confirm')}
              size="small"
              type="password"
              error={!!errors.confirm?.message}
              helperText={errors.confirm?.message}
            />
          </GridBox>
          <Footer>
            <Button variant="contained" type="submit">
              Confirmar
            </Button>
          </Footer>
        </Form>
      </CustomBox>
    </Container>
  )
}
