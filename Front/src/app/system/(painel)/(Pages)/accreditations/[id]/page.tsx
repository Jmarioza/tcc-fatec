'use client'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { Container } from '@/components/Container'
import { CustomBox } from '@/components/CustomBox'
import { GridBox } from '@/components/GridBox'
import { AccreditedHabilites } from '@/dtos/AccreditedHabilites'
import { useToast } from '@/hooks/useToast'
import { Accredited, accreditedService } from '@/services/accreditedService'
import { serviceHabilitService } from '@/services/serviceHabilitService'
import { ContentCopy } from '@mui/icons-material'
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Switch,
  TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { NavigationContainer } from '@/components/NavigationContainer'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/Form'
import { Footer } from '@/components/Footer'
import { Info } from '@/components/Info'

interface Props {
  params: {
    id: string
  }
}

export default function AccreditedPage({ params: { id } }: Props) {
  const [accredited, setAccredited] = useState<Accredited>({} as Accredited)
  const [contractServices, setContractServices] = useState<
    AccreditedHabilites[]
  >([])

  const { register, reset, handleSubmit } = useForm<Accredited>()

  const toast = useToast()

  async function handleSubmitForm(accreditedForm: Accredited) {
    try {
      await accreditedService.update(Number(id), accreditedForm)
      toast.success('Credenciamento modificado com sucesso.')
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  async function handleHabiliteisChange(item: AccreditedHabilites) {
    try {
      await serviceHabilitService.createOrUpdate({
        id: {
          accreditedId: Number(id),
          contractId: item.contractId,
        },
        status: item.habilitStatus === 'ENABLED' ? 'DISABLED' : 'ENABLED',
      })
      await fetchServiceHabilites()
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  async function fetchServiceHabilites() {
    try {
      const contracts = await serviceHabilitService.getByAccreditedId(
        Number(id),
      )
      if (contracts) setContractServices(contracts)
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  useEffect(() => {
    async function fetchAccredited() {
      try {
        const data = await accreditedService.getByIdWithRelations(Number(id))
        if (data) {
          setAccredited(data)
          reset(data)
        }
        await fetchServiceHabilites()
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    }
    fetchAccredited()
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
              href: '/system/accreditations',
              description: 'Credenciamentos',
            },
            {
              description: 'Detalhes',
            },
          ]}
        />
      </NavigationContainer>
      <CustomBox title="Credenciadora">
        <GridBox>
          <Info
            title="Razão Social"
            description={accredited.accreditorCompany?.corporateReason}
          />

          <Info
            title="Nome Fantasia"
            description={accredited.accreditorCompany?.name}
          />
        </GridBox>
      </CustomBox>
      <CustomBox title="Credenciada">
        <GridBox>
          <Info
            title="Razão Social"
            description={accredited.accreditedCompany?.corporateReason}
          />

          <Info
            title="Nome Fantasia"
            description={accredited.accreditedCompany?.name}
          />
        </GridBox>
      </CustomBox>
      <CustomBox title="Serviços Habilitados">
        <List>
          {contractServices.map((item) => (
            <ListItem key={item.contractId}>
              <ListItemText>{item.serviceName}</ListItemText>
              <Switch
                value={item.habilitStatus === 'ENABLED'}
                checked={item.habilitStatus === 'ENABLED'}
                onChange={() => handleHabiliteisChange(item)}
              />
            </ListItem>
          ))}
        </List>
      </CustomBox>
      <CustomBox title="Credencial">
        <GridBox>
          <TextField
            label="Token"
            disabled={true}
            onChange={() => null}
            value={accredited.credential}
            InputLabelProps={{ shrink: true }}
          />

          <Button
            startIcon={<ContentCopy />}
            onClick={() => {
              navigator.clipboard.writeText(accredited.credential)
              toast.success('Credencial copiada para área de transferência.')
            }}
          >
            Copiar
          </Button>
        </GridBox>
      </CustomBox>

      <Form onSubmit={handleSubmit(handleSubmitForm)}>
        <CustomBox title="Contatos">
          <GridBox column={6}>
            <TextField
              label="Nome"
              size="small"
              sx={{ gridColumn: 'span 4' }}
              InputLabelProps={{ shrink: true }}
              {...register('contactName')}
            />
            <TextField
              label="Email"
              size="small"
              type="email"
              InputLabelProps={{ shrink: true }}
              {...register('contactName')}
            />
            <TextField
              label="Telefone"
              size="small"
              InputLabelProps={{ shrink: true }}
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
