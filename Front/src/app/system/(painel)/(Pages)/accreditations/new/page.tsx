'use client'
import { useEffect, useState } from 'react'
import { Container } from '@/components/Container'
import { CustomBox } from '@/components/CustomBox'
import { useToast } from '@/hooks/useToast'
import { accreditedService } from '@/services/accreditedService'
import { Accreditor, accreditorService } from '@/services/accreditorService'
import { companyService } from '@/services/companyService'
import { Button, IconButton, TextField } from '@mui/material'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AccreditedForm, AccreditedSchema } from '@/schemas/AddAccredited'
import { CompanyDTO } from '@/dtos/Company'
import { serviceContractService } from '@/services/serviceContractService'
import { ServiceContractDTO } from '@/dtos/ServiceContracts'
import { serviceTypeService } from '@/services/serviceTypeService'
import { ServiceTypeDTO } from '@/dtos/ServiceType'
import { GridBox } from '@/components/GridBox'
import { Add, Delete } from '@mui/icons-material'
import { Form } from '@/components/Form'
import { Footer } from '@/components/Footer'
import { serviceHabilitService } from '@/services/serviceHabilitService'
import { useRouter } from 'next/navigation'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'
import { Autocomplete } from '@/components/Autocomplete'

interface ServiceContract extends ServiceContractDTO {
  service: ServiceTypeDTO | undefined
}

export default function CreateCredentialPage() {
  const [accreditors, setAccreditors] = useState<Accreditor[]>([])
  const [companies, setCompanies] = useState<CompanyDTO[]>([])
  const [services, setServices] = useState<ServiceTypeDTO[]>([])
  const [servicesContract, setServicesContract] = useState<ServiceContract[]>(
    [],
  )

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<AccreditedForm>({
    resolver: zodResolver(AccreditedSchema),
    defaultValues: {
      status: 'ENABLED',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'services',
  })

  const { accreditorId, companyId } = watch()
  const toast = useToast()
  const { push } = useRouter()

  async function handleAddAccredited(accredited: AccreditedForm) {
    try {
      const res = await accreditedService.create({
        accreditorId: accredited.accreditorId,
        companyId: accredited.companyId,
        status: 'ENABLED',
        contactEmail: accredited.contactEmail,
        contactName: accredited.contactName,
        contactPhoneNumber: accredited.contactPhoneNumber,
      })
      if (res?.id) {
        for (const item of accredited.services) {
          await serviceHabilitService.createOrUpdate({
            id: {
              accreditedId: res.id,
              contractId: item.contractId,
            },
            status: 'ENABLED',
          })
        }
        toast.success('Credenciamento realizado com sucesso.')
        push('./')
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  useEffect(() => {
    ;(async function () {
      try {
        const [companiesData, accreditorsData, servicesData] =
          await Promise.all([
            companyService.getAll(),
            accreditorService.getAll(),
            serviceTypeService.getAll(),
          ])
        if (companiesData && accreditorsData) {
          const accreditorWithRelations: Accreditor[] = accreditorsData.map(
            (item) => {
              return {
                ...item,
                company: companiesData.find((c) => c.id === item.companyId),
              }
            },
          )
          setAccreditors(accreditorWithRelations)
          setCompanies(companiesData)
          setServices(servicesData || [])
        }
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        if (accreditorId) {
          const contractsData =
            await serviceContractService.getByAccreditorId(accreditorId)

          if (contractsData) {
            const servicesContract: ServiceContract[] = contractsData.map(
              (item) => {
                return {
                  ...item,
                  service: services.find((s) => s.id === item.serviceId),
                }
              },
            )
            setServicesContract(servicesContract)
          }
        }
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    })()
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
              href: '/system/accreditations',
              description: 'Credenciamentos',
            },
            {
              description: 'Novo',
            },
          ]}
        />
      </NavigationContainer>
      <Form onSubmit={handleSubmit(handleAddAccredited)}>
        <CustomBox title="Credenciamento">
          <GridBox>
            <Autocomplete
              getValue={() =>
                accreditors.find((item) => item.id === accreditorId)
              }
              options={accreditors}
              getOptionKey={(o) => o?.id}
              getOptionLabel={(o) => o?.company?.name}
              label="Credenciadora"
              onChange={(o) => setValue('accreditorId', Number(o?.id))}
            />

            <Autocomplete
              getValue={() => companies.find((item) => item.id === companyId)}
              options={companies}
              getOptionKey={(o) => o?.id}
              getOptionLabel={(o) => o?.name}
              label="Empresa"
              onChange={(o) => setValue('companyId', Number(o?.id))}
            />
          </GridBox>
        </CustomBox>
        <CustomBox title="Serviços">
          {fields.map((field, index) => (
            <GridBox key={index} column={14}>
              <TextField
                InputLabelProps={{ shrink: true }}
                label="Serviço"
                size="small"
                select
                sx={{ gridColumn: 'span 13' }}
                defaultValue={0}
                SelectProps={{
                  native: true,
                  inputProps: {
                    ...register(`services.${index}.contractId`, {
                      valueAsNumber: true,
                    }),
                  },
                }}
              >
                <option value={0} />
                {servicesContract.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.service?.name}
                  </option>
                ))}
              </TextField>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <IconButton onClick={() => remove(index)}>
                  <Delete />
                </IconButton>
              </div>
            </GridBox>
          ))}
          <Button
            startIcon={<Add />}
            variant="text"
            fullWidth
            onClick={() =>
              append({
                contractId: 0,
                status: 'ENABLED',
              })
            }
          >
            Adicionar
          </Button>
        </CustomBox>

        <CustomBox title="Contatos">
          <GridBox column={12}>
            <TextField
              label="Nome"
              size="small"
              sx={{ gridColumn: 'span 8' }}
              {...register('contactName')}
            />
            <TextField
              label="Email"
              size="small"
              type="email"
              error={!!errors.contactEmail?.message}
              helperText={errors.contactEmail?.message}
              sx={{ gridColumn: 'span 2' }}
              {...register('contactEmail')}
            />
            <TextField
              label="Telefone"
              size="small"
              error={!!errors.contactEmail?.message}
              helperText={errors.contactEmail?.message}
              sx={{ gridColumn: 'span 2' }}
              {...register('contactPhoneNumber')}
            />
          </GridBox>
        </CustomBox>

        <Footer>
          <Button variant="contained" type="submit">
            Confirmar
          </Button>
        </Footer>
      </Form>
    </Container>
  )
}
