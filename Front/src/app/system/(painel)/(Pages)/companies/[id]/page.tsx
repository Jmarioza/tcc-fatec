'use client'
import { useForm } from 'react-hook-form'
import { CompanyForm, CompanySchema } from '@/schemas/Company'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField, Button } from '@mui/material'
import { CustomBox } from '@/components/CustomBox'
import { useToast } from '@/hooks/useToast'
import { useEffect } from 'react'
import { companyService } from '@/services/companyService'
import { Container } from '@/components/Container'
import { Form } from '@/components/Form'
import { Footer } from '@/components/Footer'
import { GridBox } from '@/components/GridBox'
import { STATES } from '@/constants/states'
import { useRouter } from 'next/navigation'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'
import { TYPE_PERSON } from '@/constants/typePerson'
import { TAX_REGIME_TYPE } from '@/constants/taxRegimeType'
import { sanitize } from '@/func/sanitize'
import { formatCEP, formatCNPJ, formatCPF } from '@/func/formmatter'

interface Props {
  params: {
    id: string
  }
}

export default function CreateAccreditorPage({ params: { id } }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CompanyForm>({
    resolver: zodResolver(CompanySchema),
    reValidateMode: 'onBlur',
  })

  const toast = useToast()
  const { status, typePerson } = watch()
  const { push } = useRouter()

  async function handleConfirmForm(acc: CompanyForm) {
    try {
      await companyService.update(Number(id), {
        ...acc,
        cpf: acc.cpf && sanitize(acc.cpf),
        cpfPersonResponsible:
          acc.cpfPersonResponsible && sanitize(acc.cpfPersonResponsible),
        cnpj: acc.cnpj && sanitize(acc.cnpj),
        rg: acc.rg && sanitize(acc.rg),
        cep: acc.cep && sanitize(acc.cep),
        ie: acc.ie && sanitize(acc.ie),
        im: acc.im && sanitize(acc.im),
        cnae: acc.cnae && sanitize(acc.cnae),
        phoneNumber: acc.phoneNumber && sanitize(acc.phoneNumber),
      })
      toast.success('Empresa modificada com sucesso.')
      push('./')
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  useEffect(() => {
    async function fetchAccreditorById() {
      try {
        const data = await companyService.getById(Number(id))
        if (data)
          reset({
            ...data,
            cnpj: data.cnpj && formatCNPJ(data.cnpj),
            cpf: data.cpf && formatCPF(data.cpf),
            cep: data.cep && formatCEP(data.cep),
          })
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    }
    fetchAccreditorById()
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
              href: '/system/companies',
              description: 'Empresas',
            },
            {
              description: 'Detalhes',
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
              InputLabelProps={{ shrink: true }}
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
                  InputLabelProps={{ shrink: true }}
                  label="CNPJ"
                  error={!!errors.cnpj?.message}
                  helperText={errors.cnpj?.message}
                  sx={{ gridColumn: 'span 4' }}
                  size="small"
                  {...register('cnpj')}
                />
                <TextField
                  InputLabelProps={{ shrink: true }}
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
                  InputLabelProps={{ shrink: true }}
                  label="CPF"
                  error={!!errors.cpf?.message}
                  helperText={errors.cpf?.message}
                  size="small"
                  sx={{ gridColumn: 'span 4' }}
                  {...register('cpf')}
                />
                <TextField
                  InputLabelProps={{ shrink: true }}
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
              InputLabelProps={{ shrink: true }}
              sx={{ gridColumn: 'span 4' }}
              label="Inscrição Municipal"
              error={!!errors.im?.message}
              helperText={errors.im?.message}
              size="small"
              {...register('im')}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
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
              InputLabelProps={{ shrink: true }}
              label="CNAE"
              error={!!errors.cnae?.message}
              helperText={errors.cnae?.message}
              size="small"
              sx={{ gridColumn: 'span 4' }}
              {...register('cnae')}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
              label="Razão Social"
              required
              error={!!errors.corporateReason?.message}
              helperText={errors.corporateReason?.message}
              size="small"
              sx={{ gridColumn: 'span 14' }}
              {...register('corporateReason')}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
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
              InputLabelProps={{ shrink: true }}
              label="CEP"
              error={!!errors.cep?.message}
              helperText={errors.cep?.message}
              size="small"
              sx={{ gridColumn: 'span 3' }}
              {...register('cep')}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
              label="Logradouro"
              error={!!errors.address?.message}
              helperText={errors.address?.message}
              sx={{ gridColumn: 'span 10' }}
              size="small"
              {...register('address')}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
              label="Número"
              error={!!errors.addressNumber?.message}
              helperText={errors.addressNumber?.message}
              size="small"
              sx={{ gridColumn: 'span 3' }}
              {...register('addressNumber')}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
              label="Complemento"
              error={!!errors.complement?.message}
              helperText={errors.complement?.message}
              size="small"
              sx={{ gridColumn: 'span 8' }}
              {...register('complement')}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
              label="Bairro"
              error={!!errors.neighborhood?.message}
              helperText={errors.neighborhood?.message}
              sx={{ gridColumn: 'span 8' }}
              size="small"
              {...register('neighborhood')}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
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
              InputLabelProps={{ shrink: true }}
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
              InputLabelProps={{ shrink: true }}
              label="Email"
              type="email"
              error={!!errors.email?.message}
              helperText={errors.email?.message}
              size="small"
              sx={{ gridColumn: 'span 3' }}
              {...register('email')}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
              label="Telefone"
              error={!!errors.phoneNumber?.message}
              helperText={errors.phoneNumber?.message}
              size="small"
              sx={{ gridColumn: 'span 2' }}
              {...register('phoneNumber')}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
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
