import { useState, useEffect } from 'react'
import { CustomBox } from '@/components/CustomBox'
import { CompanyDTO } from '@/dtos/Company'
import { UserRolesDTO } from '@/dtos/UserRoles'
import { useToast } from '@/hooks/useToast'
import { userRolesService } from '@/services/userRolesService'
import { companyService } from '@/services/companyService'
import { Form } from '@/components/Form'
import { GridBox } from '@/components/GridBox'
import { Button, IconButton, TextField } from '@mui/material'
import { Footer } from '@/components/Footer'
import { useForm } from 'react-hook-form'
import { TYPE_USER } from '@/constants/typeUser'
import { Delete } from '@mui/icons-material'
import { Info } from '@/components/Info'
import { Autocomplete } from '@/components/Autocomplete'
import { UserBeneficiaryGroup } from '../UserBeneficiaryGroup'

interface Props {
  userId: number
}

interface UserRoles extends UserRolesDTO {
  company: CompanyDTO | undefined
}

export function UserRoles({ userId }: Props) {
  const [companies, setCompanies] = useState<CompanyDTO[]>([])
  const [userRoles, setUserRoles] = useState<UserRoles[]>([])
  const toast = useToast()
  const { register, setValue, handleSubmit, watch } = useForm<UserRolesDTO>()

  const { id } = watch()

  async function fetchUserRoles() {
    try {
      const userData = await userRolesService.getByUserId(userId)
      const data = await companyService.getAll()
      if (userData && data) {
        setUserRoles(
          userData.map((item) => {
            return {
              ...item,
              company: data.find((comp) => comp.id === item.id.companyId),
            }
          }),
        )
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  async function handleAddUserRole(role: UserRolesDTO) {
    try {
      await userRolesService.create({
        ...role,
      })
      toast.success('Permissão adicionada com sucesso.')
      await fetchUserRoles()
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  async function handleDeleteUserRole(item: UserRoles) {
    try {
      await userRolesService.deleteById(item.id)
      await fetchUserRoles()
      toast.success('Permissão excluída com sucesso.')
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  useEffect(() => {
    ;(async function () {
      try {
        const data = await companyService.getAll()
        setCompanies(data || [])
        fetchUserRoles()
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    })()
    setValue('id.userId', userId)
  }, [])

  return (
    <Form onSubmit={handleSubmit(handleAddUserRole)}>
      <CustomBox title="Permissões de acesso">
        {userRoles.map((item, index) => (
          <div
            key={index}
            style={{
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <Info
                  title={item.company?.name || 'Empresa'}
                  description={
                    TYPE_USER.find((i) => i.value === item.id.typeUser)?.label
                  }
                />
              </div>
              <div>
                <IconButton onClick={() => handleDeleteUserRole(item)}>
                  <Delete />
                </IconButton>
              </div>
            </div>
            {item.id.typeUser === 'LIMITED_ACCREDITOR' && (
              <UserBeneficiaryGroup accreditorId={1} userId={item.id.userId} />
            )}
          </div>
        ))}
      </CustomBox>
      <CustomBox title="Adicionar permissão">
        <>
          <GridBox column={6}>
            <Autocomplete
              sx={{ gridColumn: 'span 4' }}
              getValue={() =>
                companies.find((item) => item.id === id.companyId)
              }
              options={companies}
              getOptionKey={(o) => o?.id}
              getOptionLabel={(o) => o?.name}
              label="Empresa"
              onChange={(o) => setValue('id.companyId', Number(o?.id))}
            />

            <TextField
              InputLabelProps={{ shrink: true }}
              label="Perfil de acesso"
              size="small"
              sx={{ gridColumn: 'span 2' }}
              select
              SelectProps={{
                native: true,
                inputProps: { ...register('id.typeUser') },
              }}
            >
              {TYPE_USER.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </TextField>
          </GridBox>
        </>
        <Footer>
          <Button variant="contained" type="submit">
            Adicionar
          </Button>
        </Footer>
      </CustomBox>
    </Form>
  )
}
