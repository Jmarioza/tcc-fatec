import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import {
  ShoppingCart,
  Storefront,
  PersonAdd,
  Wallet,
  Business,
  Dashboard,
} from '@mui/icons-material'
import Link from 'next/link'

export function AsideListItens() {
  return (
    <>
      <a href="/accredited_m" title="Dashboard">
        <ListItemButton>
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </a>
      <Link href="/accredited_m/transactions" title="Transações">
        <ListItemButton>
          <ListItemIcon>
            <Wallet />
          </ListItemIcon>
          <ListItemText primary="Transações" />
        </ListItemButton>
      </Link>

      <Link href="/accredited_m/accreditations" title="Credenciamentos">
        <ListItemButton>
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText primary="Credenciamentos" />
        </ListItemButton>
      </Link>

      <Link href="/accredited_m/products" title="Produtos">
        <ListItemButton>
          <ListItemIcon>
            <ShoppingCart />
          </ListItemIcon>
          <ListItemText primary="Produtos" />
        </ListItemButton>
      </Link>
      <Link href="/accredited_m/company" title="Empresa">
        <ListItemButton>
          <ListItemIcon>
            <Business />
          </ListItemIcon>
          <ListItemText primary="Empresa" />
        </ListItemButton>
      </Link>
      <Link href="/accredited_m/me" title="Usuário">
        <ListItemButton>
          <ListItemIcon>
            <PersonAdd />
          </ListItemIcon>
          <ListItemText primary="Usuário" />
        </ListItemButton>
      </Link>
    </>
  )
}
