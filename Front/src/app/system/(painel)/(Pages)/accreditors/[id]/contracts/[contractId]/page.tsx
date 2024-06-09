'use client'
import { Container } from '@/components/Container'
import { CustomBox } from '@/components/CustomBox'
import { GridBox } from '@/components/GridBox'
import { Footer } from '@/components/Footer'
import { Form } from '@/components/Form'
import { CompanyDTO } from '@/dtos/Company'
import { ServiceContractInputDTO } from '@/dtos/ServiceContracts'
import { ServiceTypeDTO } from '@/dtos/ServiceType'
import { useToast } from '@/hooks/useToast'
import { accreditorService } from '@/services/accreditorService'
import { companyService } from '@/services/companyService'
import { serviceContractService } from '@/services/serviceContractService'
import { serviceTypeService } from '@/services/serviceTypeService'
import { Button, TextField } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { COMMISSION_TYPE } from '@/constants/commissionType'
import { NavigationContainer } from '@/components/NavigationContainer'
import { Breadcrumb } from '@/components/Breadcrumbs'

interface Props {
  params: {
    id: number
    contractId: number
  }
}

export default function ContractPage({ params: { id, contractId } }: Props) {
  const [service, setService] = useState<ServiceTypeDTO>({} as ServiceTypeDTO)
  const [company, setCompany] = useState<CompanyDTO>({} as CompanyDTO)
  const { push } = useRouter()
  const { register, reset, handleSubmit, watch, setValue } =
    useForm<ServiceContractInputDTO>()

  const { serviceId, maximumCharge, commission, commissionType } = watch()

  const toast = useToast()

  useEffect(() => {
    if (contractId) {
      ;(async function name() {
        try {
          const data = await serviceContractService.getById(Number(contractId))
          if (data) {
            reset(data)
          }
        } catch (error) {
          if (error instanceof Error) toast.error(error.message)
        }
      })()
    }
  }, [])

  useEffect(() => {
    ;(async function () {
      try {
        if (serviceId) {
          const data = await serviceTypeService.getById(serviceId)
          if (data) setService(data)
        }

        const dataAcreditor = await accreditorService.getById(Number(id))
        if (dataAcreditor) {
          const dataCompany = await companyService.getById(
            dataAcreditor.companyId,
          )
          if (dataCompany) setCompany(dataCompany)
        }
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    })()
  }, [serviceId, id])

  async function handleConfirmForm(serverType: ServiceContractInputDTO) {
    try {
      await serviceContractService.update(contractId, serverType)
      toast.success('Contrato modificado com sucesso.')
      push(`../`)
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
              href: '/system',
              description: 'Home',
            },
            {
              href: '/system/accreditors',
              description: 'Credenciadoras',
            },
            {
              href: `/system/accreditors/${id}`,
              description: 'Detalhes',
            },
            {
              description: 'Contrato',
            },
          ]}
        />
      </NavigationContainer>
      <Form onSubmit={handleSubmit(handleConfirmForm)}>
        <CustomBox title="Contratos">
          <GridBox column={14}>
            <TextField
              InputLabelProps={{ shrink: true }}
              label="Credenciadora"
              disabled
              size="small"
              sx={{ gridColumn: 'span 14' }}
              value={company.name}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
              label="Serviço Contratado"
              disabled
              size="small"
              sx={{ gridColumn: 'span 6' }}
              value={service.name}
            />

            <TextField
              InputLabelProps={{ shrink: true }}
              label="Tipo de Taxa"
              select
              SelectProps={{
                native: true,
                inputProps: {
                  ...register('commissionType'),
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
              prefix={commissionType === 'VALUE' ? 'R$ ' : '% '}
              value={commission}
              required={true}
              size="small"
              allowNegative={false}
              decimalScale={2}
              fixedDecimalScale
              decimalSeparator=","
              customInput={TextField}
              onValueChange={(values) => {
                setValue('commission', Number(values.floatValue))
              }}
            />

            <NumericFormat
              sx={{ gridColumn: 'span 3' }}
              label="Cobrança Máxima"
              prefix="R$ "
              value={maximumCharge}
              required={true}
              size="small"
              allowNegative={false}
              decimalScale={2}
              fixedDecimalScale
              decimalSeparator=","
              customInput={TextField}
              onValueChange={(values) => {
                setValue('maximumCharge', Number(values.floatValue))
              }}
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
