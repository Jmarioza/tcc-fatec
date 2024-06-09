'use client'
import { CustomBox } from '@/components/CustomBox'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/useToast'
import { Container } from '@/components/Container'
import { TransactionDTO } from '@/dtos/Transaction'
import {
  SearchForm,
  SearchParams,
  transactionsService,
} from '@/services/transactionsService'
import { TableTransaction } from './components/TableTransaction'
import { Form } from '@/components/Form'
import { Button, TextField } from '@mui/material'
import { Accredited, accreditedService } from '@/services/accreditedService'
import { useForm } from 'react-hook-form'
import { ProductDTO } from '@/dtos/Product'
import { ProductGroupDTO } from '@/dtos/ProductGroup'
import { productService } from '@/services/productService'
import { productGroupService } from '@/services/productGroupService'
import { GridBox } from '@/components/GridBox'
import {
  FileDownload,
  FilterAlt,
  FilterAltOff,
  Search,
} from '@mui/icons-material'
import { Footer } from '@/components/Footer'
import { Breadcrumb } from '@/components/Breadcrumbs'
import { NavigationContainer } from '@/components/NavigationContainer'
import { Autocomplete } from '@/components/Autocomplete'
import { Loading } from '@/components/Loading'
import { BeneficiaryGroupDTO } from '@/dtos/BeneficiaryGroup'
import { beneficiaryGroupService } from '@/services/beneficiaryGroupService'
import { useAccreditor } from '@/hooks/useAccreditor'
import { sanitize } from '@/func/sanitize'
import { BeneficiarySubGroupDTO } from '@/dtos/BeneficiarySubGroup'
import { beneficiarySubGroupService } from '@/services/beneficiarySubGroupService'
import { ReportModal } from '@/components/Report/Modal/Transaction'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionDTO[]>([])
  const [accrediteds, setAccrediteds] = useState<Accredited[]>([])
  const [products, setProducts] = useState<ProductDTO[]>([])
  const [groups, setGroups] = useState<ProductGroupDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [beneficiaryGroups, setBeneficiaryGroups] = useState<
    BeneficiaryGroupDTO[]
  >([])
  const [beneficiarySubGroups, setBeneficiarySubGroups] = useState<
    BeneficiarySubGroupDTO[]
  >([])
  const [isShowFilters, setIsShowFilters] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [reportParams, setReportParams] = useState<SearchParams>()

  const toast = useToast()
  const { accreditor } = useAccreditor()

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SearchForm>({
    defaultValues: {
      dateStart: new Date().toISOString().split('T')[0],
      dateEnd: new Date().toISOString().split('T')[0],
      productId: undefined,
      productGroupId: undefined,
    },
  })

  const {
    accreditedId,
    productGroupId,
    productId,
    beneficiaryGroupId,
    beneficiarySubgroupId,
  } = watch()

  async function fetchTransactions(search: SearchParams) {
    try {
      setIsLoading(true)
      setReportParams(search)
      const cpf = search.cpfBeneficiary
        ? sanitize(search.cpfBeneficiary)
        : undefined
      const data = await transactionsService.get({
        ...search,
        cpfBeneficiary: cpf,
        accreditorId: accreditor.id,
      })
      setTransactions(data || [])
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (accreditor.id) {
      ;(async function () {
        try {
          const [accreditedsData, productsGroupsData, beneficiariesGroupData] =
            await Promise.all([
              accreditedService.getByAccreditor(accreditor.id),
              productGroupService.getByAccreditor(accreditor.id),
              beneficiaryGroupService.getByAccreditorId(accreditor.id),
            ])
          setAccrediteds(accreditedsData || [])
          setGroups(productsGroupsData || [])
          setBeneficiaryGroups(beneficiariesGroupData || [])
        } catch (error) {
          if (error instanceof Error) toast.error(error.message)
        }
      })()
    }
  }, [accreditor.id])

  useEffect(() => {
    if (productGroupId) {
      ;(async function () {
        try {
          const data = await productService.getByProductGroup(productGroupId)
          setProducts(data || [])
        } catch (error) {
          if (error instanceof Error) toast.error(error.message)
        }
      })()
    } else {
      setValue('productId', undefined)
    }
  }, [productGroupId])

  function handleToggleFilter() {
    setIsShowFilters(!isShowFilters)
  }

  useEffect(() => {
    if (beneficiaryGroupId) {
      ;(async function () {
        try {
          const data =
            await beneficiarySubGroupService.getByGroupId(beneficiaryGroupId)
          setBeneficiarySubGroups(data || [])
        } catch (error) {
          if (error instanceof Error) toast.error(error.message)
        }
      })()
    } else {
      setValue('beneficiarySubgroupId', undefined)
    }
  }, [beneficiaryGroupId])

  return (
    <Container>
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(!isReportModalOpen)}
        transactions={transactions}
        typeUser="ACCREDITOR"
        params={reportParams}
      />
      <Loading isLoading={isLoading} />
      <NavigationContainer>
        <Breadcrumb
          crumbs={[
            {
              href: '/accreditor',
              description: 'Home',
            },
            {
              description: 'Transações',
            },
          ]}
        />
      </NavigationContainer>
      <Form onSubmit={handleSubmit(fetchTransactions)}>
        <CustomBox>
          <GridBox column={12}>
            <TextField
              InputLabelProps={{ shrink: true }}
              sx={{ gridColumn: 'span 2' }}
              label="Data de Início"
              size="small"
              type="date"
              {...register('dateStart')}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
              sx={{ gridColumn: 'span 2' }}
              label="Data de Fim"
              size="small"
              type="date"
              {...register('dateEnd')}
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
                setValue('accreditedId', o?.id ? Number(o?.id) : undefined)
              }
              errorMessage={errors.accreditedId?.message}
            />
            <TextField
              label="Situação"
              select
              SelectProps={{
                native: true,
                inputProps: { ...register('statusTransaction') },
              }}
              defaultValue="OK"
              size="small"
              sx={{ gridColumn: 'span 2' }}
              {...register('statusTransaction')}
            >
              <option value="OK">Ok</option>
              <option value="CANCELED">Cancelado</option>
            </TextField>

            <Button
              startIcon={isShowFilters ? <FilterAltOff /> : <FilterAlt />}
              onClick={handleToggleFilter}
            >
              Filtros
            </Button>

            {isShowFilters && (
              <>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  sx={{ gridColumn: 'span 4' }}
                  label="Referência"
                  size="small"
                  {...register('localTransactionReference')}
                />

                <Autocomplete
                  sx={{ gridColumn: 'span 3' }}
                  getValue={() =>
                    groups.find((item) => item.id === productGroupId)
                  }
                  options={groups}
                  getOptionKey={(o) => o?.id}
                  getOptionLabel={(o) => o?.name}
                  label="Grupo de Produto"
                  onChange={(o) =>
                    setValue(
                      'productGroupId',
                      o?.id ? Number(o?.id) : undefined,
                    )
                  }
                  errorMessage={errors.productGroupId?.message}
                />
                <Autocomplete
                  sx={{ gridColumn: 'span 5' }}
                  getValue={() =>
                    products.find((item) => item.id === productId)
                  }
                  options={products}
                  getOptionKey={(o) => o?.id}
                  getOptionLabel={(o) => o?.name}
                  label="Produto"
                  onChange={(o) =>
                    setValue('productId', o?.id ? Number(o?.id) : undefined)
                  }
                  errorMessage={errors.productId?.message}
                  disabled={!productGroupId}
                />
                <TextField
                  InputLabelProps={{ shrink: true }}
                  label="CPF Beneficiário"
                  variant="outlined"
                  sx={{ gridColumn: 'span 3' }}
                  size="small"
                  {...register('cpfBeneficiary')}
                />
                <Autocomplete
                  sx={{ gridColumn: 'span 4' }}
                  getValue={() =>
                    beneficiaryGroups.find(
                      (item) => item.id === beneficiaryGroupId,
                    )
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
                  errorMessage={errors.beneficiaryGroupId?.message}
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
                  errorMessage={errors.beneficiarySubgroupId?.message}
                  disabled={!beneficiaryGroupId}
                />
              </>
            )}
          </GridBox>
          <Footer>
            <Button type="submit" startIcon={<Search />} variant="contained">
              Pesquisar
            </Button>
          </Footer>
        </CustomBox>
      </Form>
      <CustomBox
        title="Transações"
        customHeader={
          transactions.length > 0 && (
            <Button
              startIcon={<FileDownload />}
              onClick={() => setIsReportModalOpen(!isReportModalOpen)}
            >
              Exportar
            </Button>
          )
        }
      >
        <TableTransaction transactions={transactions} isLoading={isLoading} />
      </CustomBox>
    </Container>
  )
}
