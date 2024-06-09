'use client'
import { useState, useEffect } from 'react'
import { Container } from '@/components/Container'
import { CustomBox } from '@/components/CustomBox'
import { GridBox } from '@/components/GridBox'
import { Footer } from '@/components/Footer'
import { ServiceContractInputDTO } from '@/dtos/ServiceContracts'
import { Button, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { ServiceTypeDTO } from '@/dtos/ServiceType'
import { useToast } from '@/hooks/useToast'
import { serviceTypeService } from '@/services/serviceTypeService'
import { Form } from '@/components/Form'
import { serviceContractService } from '@/services/serviceContractService'
import { useRouter } from 'next/navigation'
import { NumericFormat } from 'react-number-format'
import { COMMISSION_TYPE } from '@/constants/commissionType'
import { NavigationContainer } from '@/components/NavigationContainer'
import { Breadcrumb } from '@/components/Breadcrumbs'

interface Props {
  params: {
    id: number
  }
}

export default function ContractPage({ params: { id } }: Props) {
  const [services, setServices] = useState<ServiceTypeDTO[]>([])
  const { register, setValue, handleSubmit, watch } =
    useForm<ServiceContractInputDTO>()

  const toast = useToast()
  const { push } = useRouter()

  const { commissionType, commission, maximumCharge } = watch()

  useEffect(() => {
    setValue('accreditorId', id)
    ;(async function () {
      try {
        const data = await serviceTypeService.getAll()
        setServices(data || [])
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    })()
  }, [id])

  async function handleConfirmForm(serverType: ServiceContractInputDTO) {
    try {
      const res = await serviceContractService.create(serverType)
      if (res?.id) push(`../`)
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
              description: 'Novo Contrato',
            },
          ]}
        />
      </NavigationContainer>
      <Form onSubmit={handleSubmit(handleConfirmForm)}>
        <CustomBox title="Contratos">
          <GridBox column={14}>
            <TextField
              InputLabelProps={{ shrink: true }}
              label="Serviço Contratado"
              select
              SelectProps={{
                native: true,
                inputProps: {
                  ...register('serviceId'),
                },
              }}
              sx={{ gridColumn: 'span 6' }}
              size="small"
            >
              {services.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </TextField>
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
