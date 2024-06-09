'use client'
import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { UserForm, UserSchema } from '@/schemas/AddUser'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField, Button, IconButton, Switch } from '@mui/material'
import { CustomBox } from '@/components/CustomBox'
import { userService } from '@/services/userService'
import { useToast } from '@/hooks/useToast'
import { Container } from '@/components/Container'
import { Form } from '@/components/Form'
import { Footer } from '@/components/Footer'
import { GridBox } from '@/components/GridBox'
import { useRouter } from 'next/navigation'
import { CompanyDTO } from '@/dtos/Company'
import { companyService } from '@/services/companyService'
import { userRolesService } from '@/services/userRolesService'
import { Add, Delete } from '@mui/icons-material'
import { TYPE_USER } from '@/constants/typeUser'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'
import { Autocomplete } from '@/components/Autocomplete'
import { BeneficiaryGroupDTO } from '@/dtos/BeneficiaryGroup'
import { useAccreditor } from '@/hooks/useAccreditor'
import { beneficiaryGroupService } from '@/services/beneficiaryGroupService'
import { userAccreditorBeneficiaryGroupService } from '@/services/userAccreditorBeneficiaryGroupService'

export default function CreateUserPage() {
  interface ActiveBeneficiary {
    beneficiaryGroupId: number
    accreditorId: number
  }

  const [companies, setCompanies] = useState<CompanyDTO[]>([])
  const [groups, setGroups] = useState<BeneficiaryGroupDTO[]>([])

  const [activeBeneficiaryGroup, setActiveBeneficiaryGroup] = useState<
    ActiveBeneficiary[]
  >([])

  const { accreditors } = useAccreditor()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UserForm>({
    resolver: zodResolver(UserSchema),
    reValidateMode: 'onBlur',
    defaultValues: {
      status: 'ENABLED',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'roles',
  })

  const { status, roles } = watch()
  const toast = useToast()
  const { push } = useRouter()

  async function handleConfirmForm(user: UserForm) {
    try {
      const res = await userService.create({
        ...user,
        password: user.password.password,
      })
      if (res?.id) {
        for (const role of user.roles) {
          await userRolesService.create({
            id: {
              companyId: role.companyId,
              typeUser: role.typeUser,
              userId: res.id,
            },
            status: 'ENABLED',
          })
        }

        if (activeBeneficiaryGroup.length > 0) {
          for (const item of activeBeneficiaryGroup) {
            await userAccreditorBeneficiaryGroupService.create({
              id: {
                userId: res.id,
                accreditorId: item.accreditorId,
                beneficiaryGroupId: item.beneficiaryGroupId,
              },
            })
          }
        }

        toast.success('Usuário cadastrado com sucesso.')
      }
      if (res?.id) push('./')
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  function handleGroups(companyId: number) {
    const accreditor = accreditors.find((acc) => acc.companyId === companyId)
    if (accreditor) {
      return groups.filter((group) => group.accreditorId === accreditor.id)
    }
    return []
  }

  function isCheckedBeneficiaryGroup(group: BeneficiaryGroupDTO) {
    return activeBeneficiaryGroup.some(
      (item) => item.beneficiaryGroupId === group.id,
    )
  }

  function handleCheckedBeneficiaryGroup(
    isActive: boolean,
    group: BeneficiaryGroupDTO,
  ) {
    if (isActive) {
      setActiveBeneficiaryGroup((prevState) => [
        ...prevState,
        {
          accreditorId: group.accreditorId,
          beneficiaryGroupId: group.id,
        },
      ])
    } else {
      const temp = activeBeneficiaryGroup.filter(
        (item) => item.beneficiaryGroupId !== group.id,
      )
      setActiveBeneficiaryGroup(temp)
    }
  }

  useEffect(() => {
    ;(async function () {
      try {
        const [companiesResponse, groupsResponse] = await Promise.all([
          companyService.getAll(),
          beneficiaryGroupService.getAll(),
        ])

        setCompanies(companiesResponse || [])
        setGroups(groupsResponse || [])
        if (groupsResponse) {
          setActiveBeneficiaryGroup(
            groupsResponse?.map((item) => {
              return {
                accreditorId: item.accreditorId,
                beneficiaryGroupId: item.id,
              }
            }),
          )
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
              description: 'Novo',
            },
          ]}
        />
      </NavigationContainer>
      <Form onSubmit={handleSubmit(handleConfirmForm)} id="user">
        <CustomBox
          title="Novo Usuário"
          checked={status === 'ENABLED'}
          onToggleStatus={() =>
            setValue('status', status === 'ENABLED' ? 'DISABLED' : 'ENABLED')
          }
        >
          <GridBox column={8}>
            <TextField
              label="Nome Completo"
              required
              error={!!errors.name?.message}
              helperText={errors.name?.message}
              size="small"
              sx={{ gridColumn: 'span 8' }}
              {...register('name')}
            />
            <TextField
              label="E-mail"
              type="email"
              error={!!errors.username?.message}
              required
              sx={{ gridColumn: 'span 4' }}
              helperText={errors.username?.message}
              {...register('username')}
              size="small"
            />

            <TextField
              label="Senha"
              type="password"
              required
              size="small"
              sx={{ gridColumn: 'span 2' }}
              error={!!errors.password?.password?.message}
              helperText={errors.password?.password?.message}
              {...register('password.password')}
            />
            <TextField
              label="Repita a senha"
              type="password"
              required
              size="small"
              sx={{ gridColumn: 'span 2' }}
              error={!!errors.password?.confirm?.message}
              helperText={errors.password?.confirm?.message}
              {...register('password.confirm')}
            />
          </GridBox>
        </CustomBox>
        <CustomBox title="Permissões">
          {fields.map((field, index) => (
            <div key={index}>
              <GridBox key={index} column={14}>
                <Autocomplete
                  sx={{ gridColumn: 'span 10' }}
                  getValue={() =>
                    companies.find((item) => item.id === roles[index].companyId)
                  }
                  options={companies}
                  getOptionKey={(o) => o?.id}
                  getOptionLabel={(o) => o?.name}
                  label="Empresa"
                  onChange={(o) =>
                    setValue(`roles.${index}.companyId`, Number(o?.id))
                  }
                />

                <TextField
                  InputLabelProps={{ shrink: true }}
                  label="Perfil de acesso"
                  size="small"
                  sx={{ gridColumn: 'span 3 ' }}
                  select
                  SelectProps={{
                    native: true,
                    inputProps: { ...register(`roles.${index}.typeUser`) },
                  }}
                >
                  {TYPE_USER.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </TextField>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <IconButton onClick={() => remove(index)}>
                    <Delete />
                  </IconButton>
                </div>
              </GridBox>
              {roles[index].typeUser === 'LIMITED_ACCREDITOR' && (
                <table>
                  <tbody>
                    {roles[index].companyId &&
                      handleGroups(roles[index].companyId).map((group) => (
                        <tr key={group.id}>
                          <td>{group.name}</td>
                          <td>
                            <Switch
                              checked={isCheckedBeneficiaryGroup(group)}
                              onChange={(e) =>
                                handleCheckedBeneficiaryGroup(
                                  e.target.checked,
                                  group,
                                )
                              }
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}

          <Button
            startIcon={<Add />}
            variant="text"
            fullWidth
            onClick={() =>
              append({
                companyId: 0,
                status: 'ENABLED',
                typeUser: 'SYSTEM',
              })
            }
          >
            Adicionar
          </Button>
        </CustomBox>
      </Form>
      <Footer>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          form="user"
        >
          Confirmar
        </Button>
      </Footer>
    </Container>
  )
}
