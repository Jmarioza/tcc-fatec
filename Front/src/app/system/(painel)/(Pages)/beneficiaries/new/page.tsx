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
import { Footer } from '@/components/Footer'
import { GridBox } from '@/components/GridBox'
import { useRouter } from 'next/navigation'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'
import { Autocomplete } from '@/components/Autocomplete'
import { UploadFile } from '@mui/icons-material'
import { useAccreditor } from '@/hooks/useAccreditor'

export default function CreateBeneficiaryPage() {
  const [groups, setGroups] = useState<BeneficiaryGroupDTO[]>([])
  const [subGroups, setSubGroups] = useState<BeneficiarySubGroupDTO[]>([])

  const { accreditor } = useAccreditor()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BeneficiaryForm>({
    resolver: zodResolver(BeneficiarySchema),
    reValidateMode: 'onBlur',
    defaultValues: {
      status: 'ENABLED',
    },
  })

  const { beneficiaryGroupId, status, beneficiarySubgroupId } = watch()
  const toast = useToast()
  const { push } = useRouter()

  async function fetchSubGroupByGroupId(groupId: number) {
    try {
      const data = await beneficiarySubGroupService.getByGroupId(groupId)
      setSubGroups(data || [])
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  async function handleConfirmForm(beneficiary: BeneficiaryForm) {
    try {
      const res = await beneficiaryService.create(beneficiary)
      toast.success('Beneficiário cadastrado com sucesso.')
      if (res?.id) push('./')
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  useEffect(() => {
    if (accreditor.id) {
      setValue('accreditorId', accreditor.id)
      ;(async function () {
        try {
          const data = await beneficiaryGroupService.getByAccreditorId(
            accreditor.id,
          )
          setGroups(data || [])
        } catch (error) {
          if (error instanceof Error) toast.error(error.message)
        }
      })()
    }
  }, [accreditor])

  useEffect(() => {
    if (beneficiaryGroupId) {
      fetchSubGroupByGroupId(beneficiaryGroupId)
    }
  }, [beneficiaryGroupId])

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
              description: 'Novo',
            },
          ]}
        />
      </NavigationContainer>
      <Form onSubmit={handleSubmit(handleConfirmForm)}>
        <CustomBox
          title="Novo Beneficiário"
          checked={status === 'ENABLED'}
          onToggleStatus={() =>
            setValue('status', status === 'ENABLED' ? 'DISABLED' : 'ENABLED')
          }
        >
          <GridBox column={12}>
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
              {...register('name')}
            />

            <TextField
              label="CPF"
              required
              error={!!errors.cpf?.message}
              helperText={errors.cpf?.message}
              size="small"
              sx={{ gridColumn: 'span 3' }}
              {...register('cpf')}
            />
            <TextField
              label="Documento"
              required
              error={!!errors.codeRef?.message}
              helperText={errors.codeRef?.message}
              sx={{ gridColumn: 'span 3' }}
              size="small"
              {...register('codeRef')}
            />
          </GridBox>
        </CustomBox>
        <Footer>
          <Button
            onClick={() => push('new/import')}
            variant="outlined"
            startIcon={<UploadFile />}
          >
            Importar
          </Button>

          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Confirmar
          </Button>
        </Footer>
      </Form>
    </Container>
  )
}
