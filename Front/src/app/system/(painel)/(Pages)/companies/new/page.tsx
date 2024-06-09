'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField, Button, CircularProgress } from '@mui/material'
import { CustomBox } from '@/components/CustomBox'
import { useToast } from '@/hooks/useToast'
import { Container } from '@/components/Container'
import { Form } from '@/components/Form'
import { Footer } from '@/components/Footer'
import { GridBox } from '@/components/GridBox'
import { useRouter } from 'next/navigation'
import { companyService } from '@/services/companyService'
import { CompanyForm, CompanySchema } from '@/schemas/Company'
import { STATES } from '@/constants/states'
import { useEffect, useState } from 'react'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'
import { TYPE_PERSON } from '@/constants/typePerson'
import { TAX_REGIME_TYPE } from '@/constants/taxRegimeType'
import { sanitize } from '@/func/sanitize'

export default function CreateAccreditorPage() {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CompanyForm>({
    resolver: zodResolver(CompanySchema),
    reValidateMode: 'onBlur',
    defaultValues: {
      status: 'ENABLED',
      typePerson: 'LEGAL',
    },
  })

  const { status, typePerson } = watch()
  const toast = useToast()
  const { push } = useRouter()

  async function handleConfirmForm(company: CompanyForm) {
    setIsLoading(true)
    try {
      company.country = 'Brasil'
      const res = await companyService.create({
        ...company,
        cpf: company.cpf && sanitize(company.cpf),
        cpfPersonResponsible:
          company.cpfPersonResponsible &&
          sanitize(company.cpfPersonResponsible),
        cnpj: company.cnpj && sanitize(company.cnpj),
        rg: company.rg && sanitize(company.rg),
        cep: company.cep && sanitize(company.cep),
        ie: company.ie && sanitize(company.ie),
        im: company.im && sanitize(company.im),
        cnae: company.cnae && sanitize(company.cnae),
        phoneNumber: company.phoneNumber && sanitize(company.phoneNumber),
      })
      toast.success('Empresa cadastrada com sucesso.')
      if (res?.id) push('./')
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setValue('cpf', undefined)
    setValue('cnpj', undefined)
  }, [typePerson])

  if (isLoading) {
    return <CircularProgress />
  }
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
              href: '/system/companies',
              description: 'Empresas',
            },
            {
              description: 'Novo',
            },
          ]}
        />
      </NavigationContainer>
      <Form onSubmit={handleSubmit(handleConfirmForm)}>
        <CustomBox
          title="Empresa"
          checked={status === 'ENABLED'}
          onToggleStatus={() =>
            setValue('status', status === 'ENABLED' ? 'DISABLED' : 'ENABLED')
          }
        >
          <GridBox column={24}>
            <TextField
              label="Tipo de Pessoa"
              required
              error={!!errors.typePerson?.message}
              helperText={errors.typePerson?.message}
              select
              SelectProps={{
                native: true,
                inputProps: { ...register('typePerson') },
              }}
              defaultValue="LEGAL"
              size="small"
              sx={{ gridColumn: 'span 4' }}
              {...register('typePerson')}
            >
              {TYPE_PERSON.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </TextField>

            {typePerson === 'LEGAL' ? (
              <>
                <TextField
                  label="CNPJ"
                  error={!!errors.cnpj?.message}
                  helperText={errors.cnpj?.message}
                  sx={{ gridColumn: 'span 4' }}
                  size="small"
                  {...register('cnpj')}
                />
                <TextField
                  label="Inscrição Estadual"
                  sx={{ gridColumn: 'span 4' }}
                  error={!!errors.ie?.message}
                  helperText={errors.ie?.message}
                  size="small"
                  {...register('ie')}
                />
              </>
            ) : (
              <>
                <TextField
                  label="CPF"
                  error={!!errors.cpf?.message}
                  helperText={errors.cpf?.message}
                  size="small"
                  sx={{ gridColumn: 'span 4' }}
                  {...register('cpf')}
                />
                <TextField
                  label="RG"
                  error={!!errors.rg?.message}
                  helperText={errors.rg?.message}
                  size="small"
                  sx={{ gridColumn: 'span 4' }}
                  {...register('rg')}
                />
              </>
            )}

            <TextField
              sx={{ gridColumn: 'span 4' }}
              label="Inscrição Municipal"
              error={!!errors.im?.message}
              helperText={errors.im?.message}
              size="small"
              {...register('im')}
            />
            <TextField
              sx={{ gridColumn: 'span 4' }}
              label="Regime de Tributação"
              required
              error={!!errors.taxRegime?.message}
              helperText={errors.taxRegime?.message}
              size="small"
              defaultValue="SIMPLE_NATIONAL"
              select
              SelectProps={{
                native: true,
                inputProps: { ...register('taxRegime') },
              }}
            >
              {TAX_REGIME_TYPE.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </TextField>
            <TextField
              label="CNAE"
              error={!!errors.cnae?.message}
              helperText={errors.cnae?.message}
              size="small"
              sx={{ gridColumn: 'span 4' }}
              {...register('cnae')}
            />
            <TextField
              label="Razão Social"
              required
              error={!!errors.corporateReason?.message}
              helperText={errors.corporateReason?.message}
              size="small"
              sx={{ gridColumn: 'span 14' }}
              {...register('corporateReason')}
            />
            <TextField
              label="Nome Fantasia"
              required
              error={!!errors.name?.message}
              helperText={errors.name?.message}
              size="small"
              sx={{ gridColumn: 'span 10' }}
              {...register('name')}
            />
          </GridBox>
        </CustomBox>
        <CustomBox title="Endereço">
          <GridBox column={24}>
            <TextField
              label="CEP"
              error={!!errors.cep?.message}
              helperText={errors.cep?.message}
              size="small"
              sx={{ gridColumn: 'span 3' }}
              {...register('cep')}
            />
            <TextField
              label="Logradouro"
              error={!!errors.address?.message}
              helperText={errors.address?.message}
              sx={{ gridColumn: 'span 10' }}
              size="small"
              {...register('address')}
            />
            <TextField
              label="Número"
              error={!!errors.addressNumber?.message}
              helperText={errors.addressNumber?.message}
              size="small"
              sx={{ gridColumn: 'span 3' }}
              {...register('addressNumber')}
            />
            <TextField
              label="Complemento"
              error={!!errors.complement?.message}
              helperText={errors.complement?.message}
              size="small"
              sx={{ gridColumn: 'span 8' }}
              {...register('complement')}
            />
            <TextField
              label="Bairro"
              error={!!errors.neighborhood?.message}
              helperText={errors.neighborhood?.message}
              sx={{ gridColumn: 'span 8' }}
              size="small"
              {...register('neighborhood')}
            />
            <TextField
              label="Estado"
              error={!!errors.uf?.message}
              helperText={errors.uf?.message}
              sx={{ gridColumn: 'span 6' }}
              size="small"
              select
              SelectProps={{
                native: true,
                inputProps: { ...register('uf') },
              }}
            >
              {STATES.map((item) => (
                <option key={Object.keys(item)[0]} value={Object.keys(item)}>
                  {Object.values(item)[0]}
                </option>
              ))}
            </TextField>
            <TextField
              label="Cidade"
              error={!!errors.city?.message}
              helperText={errors.city?.message}
              sx={{ gridColumn: 'span 10' }}
              size="small"
              {...register('city')}
            />
          </GridBox>
        </CustomBox>
        <CustomBox title="Contatos">
          <GridBox column={6}>
            <TextField
              label="Email"
              type="email"
              error={!!errors.email?.message}
              helperText={errors.email?.message}
              size="small"
              sx={{ gridColumn: 'span 3' }}
              {...register('email')}
            />
            <TextField
              label="Telefone"
              error={!!errors.phoneNumber?.message}
              helperText={errors.phoneNumber?.message}
              size="small"
              sx={{ gridColumn: 'span 2' }}
              {...register('phoneNumber')}
            />
            <TextField
              label="Ramal"
              error={!!errors.extension?.message}
              helperText={errors.extension?.message}
              size="small"
              {...register('extension')}
            />
          </GridBox>
        </CustomBox>
        <Footer>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Confirmar
          </Button>
        </Footer>
      </Form>
    </Container>
  )
}
