'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField, Button } from '@mui/material'
import { CustomBox } from '@/components/CustomBox'
import { useToast } from '@/hooks/useToast'
import { BeneficiaryForm, BeneficiarySchema } from '@/schemas/Beneficary'
import { beneficiaryService } from '@/services/beneficiary'
import { BeneficiaryGroupDTO } from '@/dtos/BeneficiaryGroup'
import { BeneficiarySubGroupDTO } from '@/dtos/BeneficiarySubGroup'
import { beneficiaryGroupService } from '@/services/beneficiaryGroupService'
import { beneficiarySubGroupService } from '@/services/beneficiarySubGroupService'
import { Container } from '@/components/Container'
import { Form } from '@/components/Form'
import { GridBox } from '@/components/GridBox'
import { Footer } from '@/components/Footer'
import { accreditorService } from '@/services/accreditorService'
import { companyService } from '@/services/companyService'
import { CompanyDTO } from '@/dtos/Company'
import { useRouter } from 'next/navigation'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'
import { Autocomplete } from '@/components/Autocomplete'

interface Props {
  params: {
    id: string
  }
}

export default function CreateBeneficiaryPage({ params: { id } }: Props) {
  const [groups, setGroups] = useState<BeneficiaryGroupDTO[]>([])
  const [subGroups, setSubGroups] = useState<BeneficiarySubGroupDTO[]>([])
  const [company, setCompany] = useState<CompanyDTO>({} as CompanyDTO)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BeneficiaryForm>({
    resolver: zodResolver(BeneficiarySchema),
    reValidateMode: 'onBlur',
  })

  const { beneficiaryGroupId, status, accreditorId, beneficiarySubgroupId } =
    watch()
  const toast = useToast()
  const { push } = useRouter()

  async function fetchSubGroupByGroupId(groupId: number) {
    try {
      const data = await beneficiarySubGroupService.getByGroupId(groupId)
      if (data) setSubGroups(data)
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  async function handleConfirmForm(beneficiary: BeneficiaryForm) {
    try {
      await beneficiaryService.update(Number(id), beneficiary)
      toast.success('Beneficiário modificado com sucesso.')
      push('./')
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }
  useEffect(() => {
    async function fetchAllGroups() {
      try {
        const data = await beneficiaryGroupService.getAll()
        if (data) setGroups(data)
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    }

    fetchAllGroups()
  }, [])

  useEffect(() => {
    if (beneficiaryGroupId) {
      fetchSubGroupByGroupId(beneficiaryGroupId)
    }
  }, [beneficiaryGroupId])

  useEffect(() => {
    async function fetchBeneficiaryId() {
      try {
        const data = await beneficiaryService.getById(Number(id))
        if (data) reset(data)
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    }
    fetchBeneficiaryId()
  }, [])

  useEffect(() => {
    if (accreditorId) {
      ;(async function name() {
        try {
          const data = await accreditorService.getById(Number(accreditorId))
          if (data) {
            const dataCompany = await companyService.getById(data.companyId)
            if (dataCompany) setCompany(dataCompany)
          }
        } catch (error) {
          if (error instanceof Error) toast.error(error.message)
        }
      })()
    }
  }, [accreditorId])

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
              href: '/system/beneficiaries',
              description: 'Beneficiários',
            },
            {
              description: 'Detalhes',
            },
          ]}
        />
      </NavigationContainer>
      <Form onSubmit={handleSubmit(handleConfirmForm)}>
        <CustomBox
          title="Beneficiário"
          checked={status === 'ENABLED'}
          onToggleStatus={() =>
            setValue('status', status === 'ENABLED' ? 'DISABLED' : 'ENABLED')
          }
        >
          <GridBox column={12}>
            <TextField
              InputLabelProps={{ shrink: true }}
              label="Credenciadora"
              disabled
              size="small"
              sx={{ gridColumn: 'span 12' }}
              value={company.name}
            />

            <Autocomplete
              sx={{ gridColumn: 'span 7' }}
              getValue={() =>
                groups.find((item) => item.id === beneficiaryGroupId)
              }
              options={groups}
              getOptionKey={(o) => o?.id}
              getOptionLabel={(o) => o?.name}
              label="Grupo de Beneficiário"
              onChange={(o) => setValue('beneficiaryGroupId', Number(o?.id))}
              errorMessage={errors.beneficiaryGroupId?.message}
            />

            <Autocomplete
              sx={{ gridColumn: 'span 5' }}
              getValue={() =>
                subGroups.find((item) => item.id === beneficiarySubgroupId)
              }
              options={subGroups}
              getOptionKey={(o) => o?.id}
              getOptionLabel={(o) => o?.name}
              label="Subgrupo de Beneficiário"
              onChange={(o) => setValue('beneficiarySubgroupId', Number(o?.id))}
              errorMessage={errors.beneficiarySubgroupId?.message}
            />

            <TextField
              label="Nome Completo"
              required
              error={!!errors.name?.message}
              helperText={errors.name?.message}
              size="small"
              sx={{ gridColumn: 'span 6' }}
              InputLabelProps={{ shrink: true }}
              {...register('name')}
            />

            <TextField
              label="CPF"
              required
              error={!!errors.cpf?.message}
              helperText={errors.cpf?.message}
              size="small"
              sx={{ gridColumn: 'span 3' }}
              InputLabelProps={{ shrink: true }}
              {...register('cpf')}
            />
            <TextField
              label="Documento"
              required
              error={!!errors.codeRef?.message}
              helperText={errors.codeRef?.message}
              size="small"
              sx={{ gridColumn: 'span 3' }}
              InputLabelProps={{ shrink: true }}
              {...register('codeRef')}
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
