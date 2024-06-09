import { createContext, ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CustomBox } from '@/components/CustomBox'
import { GridBox } from '@/components/GridBox'
import { DashboardForm } from '@/schemas/Dashboard'
import { useAccreditor } from '@/hooks/useAccreditor'
import { Button, TextField } from '@mui/material'
import { ONE_WEEK_AGO, TODAY } from '@/utils/dateTime'
import { ProductGroupDTO } from '@/dtos/ProductGroup'
import { useToast } from '@/hooks/useToast'
import { Autocomplete } from '@/components/Autocomplete'
import { BeneficiaryGroupDTO } from '@/dtos/BeneficiaryGroup'
import { BeneficiarySubGroupDTO } from '@/dtos/BeneficiarySubGroup'
import { productGroupService } from '@/services/productGroupService'
import { beneficiaryGroupService } from '@/services/beneficiaryGroupService'
import { FilterDashboard } from '@/services/dashboardService'
import { beneficiarySubGroupService } from '@/services/beneficiarySubGroupService'
import { Accredited, accreditedService } from '@/services/accreditedService'
import { Form } from '@/components/Form'
import { authService } from '@/services/authService'
import { Search } from '@mui/icons-material'

interface DashboardContextProps {
  filters: FilterDashboard
}

export const DashboardContext = createContext<DashboardContextProps>(
  {} as DashboardContextProps,
)

interface DashboardProviderProps {
  children: ReactNode
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const { accreditor } = useAccreditor()
  const INITIAL_STATE: DashboardForm = {
    dateStart: ONE_WEEK_AGO,
    dateEnd: TODAY,
    accreditorId: accreditor.id,
  }
  const [accrediteds, setAccrediteds] = useState<Accredited[]>([])
  const [productGroups, setProductGroups] = useState<ProductGroupDTO[]>([])
  const [beneficiaryGroups, setBeneficiaryGroups] = useState<
    BeneficiaryGroupDTO[]
  >([])
  const [beneficiarySubGroups, setBeneficiarySubGroups] = useState<
    BeneficiarySubGroupDTO[]
  >([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [filters, setFilters] = useState<DashboardForm>(INITIAL_STATE)

  const { register, watch, setValue, handleSubmit } = useForm<DashboardForm>({
    defaultValues: {
      dateStart: ONE_WEEK_AGO,
      dateEnd: TODAY,
    },
    reValidateMode: 'onSubmit',
  })

  const toast = useToast()
  const {
    accreditedId,
    beneficiaryGroupId,
    productGroupId,
    beneficiarySubgroupId,
  } = watch()

  async function fetchAccrediteds() {
    try {
      setIsLoading(true)
      const { typeUser, userId } = authService.getUserAuth()
      if (['ACCREDITED', 'MASTER_ACCREDITED'].includes(typeUser)) {
        const data = await accreditedService.getByUserAndAccreditor(
          userId,
          accreditor.id,
        )
        setAccrediteds(data || [])
      } else {
        const data = await accreditedService.getByAccreditor(accreditor.id)
        setAccrediteds(data || [])
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchProductGroups() {
    try {
      setIsLoading(true)
      const data = await productGroupService.getByAccreditor(accreditor.id)
      setProductGroups(data || [])
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchBeneficiaryGroups() {
    try {
      setIsLoading(true)
      const { typeUser } = authService.getUserAuth()
      if (typeUser === 'LIMITED_ACCREDITOR') {
        const data = await beneficiaryGroupService.getByUser({
          accreditorId: accreditor.id,
        })
        setBeneficiaryGroups(data || [])
      } else {
        const data = await beneficiaryGroupService.getByAccreditorId(
          accreditor.id,
        )
        setBeneficiaryGroups(data || [])
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchBeneficiarySubGroup(groupId: number) {
    try {
      setIsLoading(true)
      const data = await beneficiarySubGroupService.getByGroupId(groupId)
      setBeneficiarySubGroups(data || [])
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleForm(form: DashboardForm) {
    setFilters({
      ...form,
      accreditorId: accreditor.id,
      accreditedId: form.accreditedId || accrediteds.map((item) => item.id),
      beneficiaryGroupId:
        form.beneficiaryGroupId || beneficiaryGroups.map((item) => item.id),
    })
  }

  useEffect(() => {
    if (accreditor.id) {
      fetchAccrediteds()
      fetchProductGroups()
      fetchBeneficiaryGroups()
      setValue('dateStart', INITIAL_STATE.dateStart)
      setValue('dateEnd', INITIAL_STATE.dateEnd)
      setFilters({ ...INITIAL_STATE, accreditorId: accreditor.id })
    }
  }, [accreditor.id])

  useEffect(() => {
    if (beneficiaryGroupId) {
      fetchBeneficiarySubGroup(beneficiaryGroupId as number)
    }
    setValue('beneficiarySubgroupId', undefined)
  }, [beneficiaryGroupId])

  const contextValue: DashboardContextProps = {
    filters,
  }

  return (
    <DashboardContext.Provider value={contextValue}>
      <CustomBox style={{ marginTop: '1rem' }}>
        <Form onSubmit={handleSubmit(handleForm)}>
          <GridBox column={12}>
            <TextField
              label="Data de Início"
              size="small"
              type="date"
              {...register('dateStart')}
              InputLabelProps={{ shrink: true }}
              style={{ gridColumn: 'span 2' }}
            />
            <TextField
              label="Data de Fim"
              size="small"
              type="date"
              {...register('dateEnd')}
              InputLabelProps={{ shrink: true }}
              style={{ gridColumn: 'span 2' }}
            />

            <Autocomplete
              sx={{ gridColumn: 'span 5' }}
              getValue={() =>
                accrediteds.find((item) => item.id === accreditedId)
              }
              options={accrediteds}
              getOptionKey={(o) => o?.id}
              getOptionLabel={(o) => o?.accreditedCompany?.name}
              label="Credenciado"
              onChange={(o) =>
                setValue('accreditedId', o?.id ? Number(o.id) : undefined)
              }
              disabled={isLoading}
            />
            <Autocomplete
              sx={{ gridColumn: 'span 3' }}
              getValue={() =>
                productGroups.find((item) => item.id === productGroupId)
              }
              options={productGroups}
              getOptionKey={(o) => o?.id}
              getOptionLabel={(o) => o?.name}
              label="Grupo de Produto"
              onChange={(o) =>
                setValue('productGroupId', o?.id ? Number(o?.id) : undefined)
              }
              disabled={isLoading}
            />
            <Autocomplete
              sx={{ gridColumn: 'span 4' }}
              getValue={() =>
                beneficiaryGroups.find((item) => item.id === beneficiaryGroupId)
              }
              options={beneficiaryGroups}
              getOptionKey={(o) => o?.id}
              getOptionLabel={(o) => o?.name}
              label="Grupo de Beneficiário"
              onChange={(o) =>
                setValue(
                  'beneficiaryGroupId',
                  o?.id ? Number(o?.id) : undefined,
                )
              }
              disabled={isLoading}
            />
            <Autocomplete
              sx={{ gridColumn: 'span 5' }}
              getValue={() =>
                beneficiarySubGroups.find(
                  (item) => item.id === beneficiarySubgroupId,
                )
              }
              options={beneficiarySubGroups}
              getOptionKey={(o) => o?.id}
              getOptionLabel={(o) => o?.name}
              label="Subgrupo de Beneficiário"
              onChange={(o) =>
                setValue(
                  'beneficiarySubgroupId',
                  o?.id ? Number(o?.id) : undefined,
                )
              }
              disabled={isLoading || !beneficiaryGroupId}
            />
            <div
              style={{
                gridColumn: 'span 3',
                display: 'flex',
                justifyContent: 'end',
              }}
            >
              <Button
                type="submit"
                startIcon={<Search />}
                variant="contained"
                style={{ gridColumn: 'span 2' }}
              >
                Aplicar
              </Button>
            </div>
          </GridBox>
        </Form>
      </CustomBox>
      {!isLoading && children}
    </DashboardContext.Provider>
  )
}
