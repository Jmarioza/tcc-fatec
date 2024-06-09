import { useEffect, useState } from 'react'
import { ProductGroupDTO } from '@/dtos/ProductGroup'
import { useToast } from '@/hooks/useToast'
import { productGroupService } from '@/services/productGroupService'
import { GridBox } from '@/components/GridBox'
import { PieChart } from './PieChart'
import { useDashboard } from '@/hooks/useDashboard'
import { Loading } from '@/components/Loading'
import { GraphProvider } from '@/contexts/GraphContext'
import { BarChart } from './BarChart'
import { productService } from '@/services/productService'
import { IconButton } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { ProductDTO } from '@/dtos/Product'
import * as S from '../styles'

export function ProductGroupChart() {
  const [productGroups, setProductGroups] = useState<ProductGroupDTO[]>([])
  const [productGroup, setProductGroup] = useState<ProductGroupDTO>()
  const [products, setProducts] = useState<ProductDTO[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const toast = useToast()
  const { filters } = useDashboard()

  const showBackButton = !filters.productGroupId || productGroups.length !== 1

  async function fetchProductsByProductGroup(group: ProductGroupDTO) {
    try {
      const data = await productService.getByProductGroup(group.id)
      setProducts(data?.filter((item) => item.status === 'ENABLED') || [])
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  function handleProductGroup(group: ProductGroupDTO | undefined) {
    setProductGroup(group)
  }

  useEffect(() => {
    setIsLoading(true)
    setProductGroup(undefined)
    ;(async function () {
      try {
        const data = await productGroupService.getByAccreditor(
          filters.accreditorId,
        )

        const productGroupsActive = data?.filter(
          (item) => item.status === 'ENABLED',
        )

        setProductGroups(productGroupsActive || [])

        if (filters.productGroupId) {
          const group = productGroups?.find(
            (item) => item.id === filters.productGroupId,
          )
          setProductGroup(group)
          return
        }

        const hasOnlyOneProductGroup = productGroupsActive?.length === 1
        if (hasOnlyOneProductGroup) {
          const [group] = productGroupsActive
          setProductGroup(group)
        }
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
      }
    })()
    setIsLoading(false)
  }, [filters])

  useEffect(() => {
    if (productGroup) {
      fetchProductsByProductGroup(productGroup)
    } else {
      setProducts([])
    }
  }, [productGroup])

  return (
    <GraphProvider title="Grupo de Produto" hasView={false}>
      {showBackButton && (
        <IconButton onClick={() => setProductGroup(undefined)}>
          <ArrowBack />
        </IconButton>
      )}
      <Loading isLoading={isLoading} />
      <GridBox column={5}>
        <S.Content
          style={{
            gridColumn: 'span 2',
          }}
        >
          <PieChart
            productGroups={productGroups}
            handleGroup={handleProductGroup}
            productGroup={productGroup}
            products={products}
          />
        </S.Content>
        <S.Content
          style={{
            gridColumn: 'span 3',
          }}
        >
          <BarChart
            productGroups={productGroups}
            handleGroup={handleProductGroup}
            productGroup={productGroup}
            products={products}
          />
        </S.Content>
      </GridBox>
    </GraphProvider>
  )
}
