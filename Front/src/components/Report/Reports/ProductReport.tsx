import { ReportContainer } from '@/components/Report/Container'
import { ReportHeader } from '@/components/Report/Header'
import { Table } from '@/components/Report/Table'
import { TableRow } from '@/components/Report/Table/Row'
import { TableBody } from '@/components/Report/Table/Body'
import { TableCell } from '@/components/Report/Table/Cell'
import { TableHeader } from '@/components/Report/Table/Header'
import { Footer } from '../Footer'
import _ from 'lodash'
import { Product } from '@/services/productService'
import { findCurrentProduct } from '@/func/findCurrentProduct'
import { formatDate } from '@/func/formmatter'

interface ProductReportProps {
  products: Product[]
}

export function ProductReport({ products }: ProductReportProps) {
  return (
    <ReportContainer orientation="portrait">
      <ReportHeader title="Produtos" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell style={{ width: 20 }}>Id</TableCell>
            <TableCell style={{ width: 40 }}>Ref</TableCell>
            <TableCell style={{ width: 250 }}>Produto</TableCell>
            <TableCell style={{ width: 100 }}>Grupo</TableCell>
            <TableCell style={{ width: 60 }}>Coparticipação</TableCell>
            <TableCell style={{ width: 60 }}>Valor</TableCell>
            <TableCell style={{ width: 40 }}>Vigência</TableCell>
          </TableRow>
        </TableHeader>
        <TableHeader>
          <TableBody>
            {_.orderBy(products, 'code', 'asc').map((product, index) => (
              <TableRow key={product.id} color={index % 2 > 0}>
                <TableCell style={{ width: 20 }}>{product.id}</TableCell>
                <TableCell style={{ width: 40 }}>{product.code}</TableCell>
                <TableCell style={{ width: 250 }}>{product.name}</TableCell>
                <TableCell style={{ width: 100 }}>
                  {product.group?.name}
                </TableCell>
                <TableCell style={{ width: 60 }}>
                  {product.values &&
                    findCurrentProduct(
                      product.values,
                    )?.valueCoparticipation.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                </TableCell>
                <TableCell style={{ width: 60 }}>
                  {product.values &&
                    findCurrentProduct(
                      product.values,
                    )?.valueProduct.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                </TableCell>
                <TableCell style={{ width: 40 }}>
                  {product.values &&
                    formatDate(
                      new Date(
                        findCurrentProduct(product.values)
                          ?.effectiveDate as string,
                      ),
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableHeader>
      </Table>
      <Footer />
    </ReportContainer>
  )
}
