'use client'
import { useState, useEffect } from 'react'
import { Container } from '@/components/Container'
import { CompanyDTO } from '@/dtos/Company'
import { useToast } from '@/hooks/useToast'
import { companyService } from '@/services/companyService'
import { CustomBox } from '@/components/CustomBox'
import { Button, IconButton, TextField } from '@mui/material'
import { GridBox } from '@/components/GridBox'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AccreditorForm, AccreditorSchema } from '@/schemas/AddAccreditor'
import { Form } from '@/components/Form'
import { Footer } from '@/components/Footer'
import { ServiceTypeDTO } from '@/dtos/ServiceType'
import { serviceTypeService } from '@/services/serviceTypeService'
import { accreditorService } from '@/services/accreditorService'
import { serviceContractService } from '@/services/serviceContractService'
import { Add, Delete } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { NumericFormat } from 'react-number-format'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'
import { COMMISSION_TYPE } from '@/constants/commissionType'
import { Autocomplete } from '@/components/Autocomplete'

export default function CreateAccreditorPage() {
  const [companies, setCompanies] = useState<CompanyDTO[]>([])
  const [services, setServices] = useState<ServiceTypeDTO[]>([])

  const toast = useToast()
  const { push } = useRouter()

  const { register, handleSubmit, watch, setValue, control } =
    useForm<AccreditorForm>({
      resolver: zodResolver(AccreditorSchema),
      reValidateMode: 'onBlur',
      defaultValues: {
        status: 'ENABLED',
      },
    })

  const { status, contracts, companyId } = watch()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contracts',
  })

  async function handleAddAccreditor(accreditor: AccreditorForm) {
    try {
      const res = await accreditorService.create({
        companyId: accreditor.companyId,
        status: accreditor.status,
      })
      if (res?.id) {
        for (const item of accreditor.contracts) {
          await serviceContractService.create({
            accreditorId: res.id,
            serviceId: item.serviceId,
            statusContract: item.status,
            commission: item.commission,
            commissionType: item.commissionType,
            maximumCharge: item.maximumCharge,
          })
        }
        toast.success('Credenciadora cadastrada com sucesso.')
        if (res?.id) push('./')
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  useEffect(() => {
    ;(async function () {
      try {
        const [companiesData, servicesData] = await Promise.all([
          companyService.getAll(),
          serviceTypeService.getAll(),
        ])
        setCompanies(companiesData || [])
        setServices(servicesData || [])
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
              href: '/system/accreditors',
              description: 'Credenciadoras',
            },
            {
              description: 'Novo',
            },
          ]}
        />
      </NavigationContainer>
      <Form onSubmit={handleSubmit(handleAddAccreditor)}>
        <CustomBox
          title="Empresa"
          checked={status === 'ENABLED'}
          onToggleStatus={() =>
            setValue('status', status === 'ENABLED' ? 'DISABLED' : 'ENABLED')
          }
        >
          <GridBox>
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
        <CustomBox title="Contratos">
          {fields.map((field, index) => (
            <GridBox key={index} column={14}>
              <Autocomplete
                sx={{ gridColumn: 'span 5' }}
                getValue={() =>
                  services.find(
                    (item) => item.id === contracts[index].serviceId,
                  )
                }
                options={services}
                getOptionKey={(o) => o?.id}
                getOptionLabel={(o) => o?.name}
                label="Serviço Contratado"
                onChange={(o) =>
                  setValue(`contracts.${index}.serviceId`, Number(o?.id))
                }
              />

              <TextField
                InputLabelProps={{ shrink: true }}
                label="Tipo de Taxa"
                select
                SelectProps={{
                  native: true,
                  inputProps: {
                    ...register(`contracts.${index}.commissionType`),
                  },
                }}
                size="small"
                sx={{ gridColumn: 'span 2' }}
              >
                {COMMISSION_TYPE.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </TextField>

              <NumericFormat
                sx={{ gridColumn: 'span 3' }}
                label="Taxa Administrativa"
                prefix={
                  contracts[index].commissionType === 'VALUE' ? 'R$ ' : '% '
                }
                value={contracts[index].commission}
                required={true}
                size="small"
                allowNegative={false}
                decimalScale={2}
                fixedDecimalScale
                decimalSeparator=","
                customInput={TextField}
                onValueChange={(values) => {
                  setValue(
                    `contracts.${index}.commission`,
                    Number(values.floatValue),
                  )
                }}
              />
              <NumericFormat
                sx={{ gridColumn: 'span 3' }}
                label="Cobrança Máxima"
                prefix="R$ "
                value={contracts[index].maximumCharge}
                required={true}
                size="small"
                allowNegative={false}
                decimalScale={2}
                fixedDecimalScale
                decimalSeparator=","
                customInput={TextField}
                onValueChange={(values) => {
                  setValue(
                    `contracts.${index}.maximumCharge`,
                    Number(values.floatValue),
                  )
                }}
              />

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
                serviceId: 0,
                commission: 0,
                commissionType: 'VALUE',
                maximumCharge: 0,
                status: 'ENABLED',
              })
            }
          >
            Adicionar
          </Button>
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
