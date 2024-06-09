import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import {
  ShoppingCart,
  Storefront,
  Business,
  PersonAdd,
  Wallet,
  Gavel,
  Groups,
  Dashboard,
} from '@mui/icons-material'
import Link from 'next/link'
import Beneficiary from '@/assets/Beneficiary.svg'
import Image from 'next/image'

export function AsideListItens() {
  return (
    <>
      <a href="/accreditor_l" title="Dashboard">
        <ListItemButton>
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </a>
      <Link href="/accreditor_l/transactions" title="Transações">
        <ListItemButton>
          <ListItemIcon>
            <Wallet />
          </ListItemIcon>
          <ListItemText primary="Transações" />
        </ListItemButton>
      </Link>

      <Link href="/accreditor_l/company" title="Empresa">
        <ListItemButton>
          <ListItemIcon>
            <Business />
          </ListItemIcon>
          <ListItemText primary="Empresa" />
        </ListItemButton>
      </Link>

      <Link href="/accreditor_l/accreditations" title="Credenciamentos">
        <ListItemButton>
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText primary="Credenciamentos" />
        </ListItemButton>
      </Link>

      <Link href="/accreditor_l/accreditor" title="Credenciadora">
        <ListItemButton>
          <ListItemIcon>
            <Gavel />
          </ListItemIcon>
          <ListItemText primary="Credenciadora" />
        </ListItemButton>
      </Link>

      <Link href="/accreditor_l/products" title="Produtos">
        <ListItemButton>
          <ListItemIcon>
            <ShoppingCart />
          </ListItemIcon>
          <ListItemText primary="Produtos" />
        </ListItemButton>
      </Link>

      <Link href="/accreditor_l/groups" title="Grupos">
        <ListItemButton>
          <ListItemIcon>
            <Groups />
          </ListItemIcon>
          <ListItemText primary="Grupos" />
        </ListItemButton>
      </Link>

      <Link href="/accreditor_l/beneficiaries" title="Beneficiários">
        <ListItemButton>
          <ListItemIcon>
            <Image src={Beneficiary} alt="logo" width={28} height={28} />
          </ListItemIcon>
          <ListItemText primary="Beneficiários" />
        </ListItemButton>
      </Link>

      <Link href="/accreditor_l/me" title="Usuário">
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
