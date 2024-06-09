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
      <a href="/accreditor" title="Dashboard">
        <ListItemButton>
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </a>
      <Link href="/accreditor/transactions" title="Transações">
        <ListItemButton>
          <ListItemIcon>
            <Wallet />
          </ListItemIcon>
          <ListItemText primary="Transações" />
        </ListItemButton>
      </Link>

      <Link href="/accreditor/company" title="Empresa">
        <ListItemButton>
          <ListItemIcon>
            <Business />
          </ListItemIcon>
          <ListItemText primary="Empresa" />
        </ListItemButton>
      </Link>

      <Link href="/accreditor/accreditations" title="Credenciamentos">
        <ListItemButton>
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText primary="Credenciamentos" />
        </ListItemButton>
      </Link>

      <Link href="/accreditor/accreditor" title="Credenciadora">
        <ListItemButton>
          <ListItemIcon>
            <Gavel />
          </ListItemIcon>
          <ListItemText primary="Credenciadora" />
        </ListItemButton>
      </Link>

      <Link href="/accreditor/products" title="Produtos">
        <ListItemButton>
          <ListItemIcon>
            <ShoppingCart />
          </ListItemIcon>
          <ListItemText primary="Produtos" />
        </ListItemButton>
      </Link>

      <Link href="/accreditor/groups" title="Grupos">
        <ListItemButton>
          <ListItemIcon>
            <Groups />
          </ListItemIcon>
          <ListItemText primary="Grupos" />
        </ListItemButton>
      </Link>

      <Link href="/accreditor/beneficiaries" title="Beneficiários">
        <ListItemButton>
          <ListItemIcon>
            <Image src={Beneficiary} alt="logo" width={28} height={28} />
          </ListItemIcon>
          <ListItemText primary="Beneficiários" />
        </ListItemButton>
      </Link>

      <Link href="/accreditor/me" title="Usuário">
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
