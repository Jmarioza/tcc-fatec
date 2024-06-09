'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { UserForm, UserSchema } from '@/schemas/User'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField, Button } from '@mui/material'
import { CustomBox } from '@/components/CustomBox'
import { userService } from '@/services/userService'
import { useToast } from '@/hooks/useToast'
import { Form } from '@/components/Form'
import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { GridBox } from '@/components/GridBox'
import { ChangePassword } from './components/ChangePassword'
import { UserRoles as UserRolesCard } from './components/UserRoles'
import { useRouter } from 'next/navigation'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'

interface Props {
  params: {
    id: string
  }
}

export default function EditUserPage({ params: { id } }: Props) {
  const userId = Number(id)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserForm>({
    resolver: zodResolver(UserSchema),
    reValidateMode: 'onBlur',
  })

  const status = watch('status')
  const toast = useToast()
  const { push } = useRouter()

  async function handleConfirmForm(user: UserForm) {
    try {
      userService.update(Number(id), user)
      toast.success('Usuário modificado com sucesso.')
      push('./')
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  useEffect(() => {
    ;(async function () {
      try {
        const userData = await userService.getById(userId)
        if (userData) {
          reset(userData)
        }
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    })()
  }, [])

  return (
    <Container>
      <NavigationContainer>
        <Breadcrumb
          crumbs={[
            {
              href: '/system',
              description: 'Home',
            },
            {
              href: '/system/users',
              description: 'Usuários',
            },
            {
              description: 'Detalhes',
            },
          ]}
        />
      </NavigationContainer>
      <Form onSubmit={handleSubmit(handleConfirmForm)}>
        <CustomBox
          title="Usuário"
          checked={status === 'ENABLED'}
          onToggleStatus={() =>
            setValue('status', status === 'ENABLED' ? 'DISABLED' : 'ENABLED')
          }
        >
          <GridBox>
            <TextField
              label="Nome Completo"
              required
              error={!!errors.name?.message}
              helperText={errors.name?.message}
              size="small"
              InputLabelProps={{ shrink: true }}
              {...register('name')}
            />
            <TextField
              label="E-mail"
              type="email"
              error={!!errors.username?.message}
              required
              helperText={errors.username?.message}
              {...register('username')}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </GridBox>
          <Footer>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              Confirmar
            </Button>
          </Footer>
        </CustomBox>
      </Form>
      <ChangePassword userId={Number(id)} />
      <UserRolesCard userId={Number(id)} />
    </Container>
  )
}
