import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import {
  ShoppingCart,
  Storefront,
  Business,
  PersonAdd,
  Wallet,
  Gavel,
  Class,
  Groups,
  Dashboard,
} from '@mui/icons-material'
import Link from 'next/link'
import Beneficiary from '@/assets/Beneficiary.svg'
import Image from 'next/image'

export function AsideListItens() {
  return (
    <>
      <a href="/system" title="Dashboard">
        <ListItemButton>
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </a>

      <Link href="/system/transactions" title="Transações">
        <ListItemButton>
          <ListItemIcon>
            <Wallet />
          </ListItemIcon>
          <ListItemText primary="Transações" />
        </ListItemButton>
      </Link>

      <Link href="/system/companies" title="Empresas">
        <ListItemButton>
          <ListItemIcon>
            <Business />
          </ListItemIcon>
          <ListItemText primary="Empresas" />
        </ListItemButton>
      </Link>

      <Link href="/system/accreditations" title="Credenciamentos">
        <ListItemButton>
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText primary="Credenciamentos" />
        </ListItemButton>
      </Link>

      <Link href="/system/accreditors" title="Credenciadoras">
        <ListItemButton>
          <ListItemIcon>
            <Gavel />
          </ListItemIcon>
          <ListItemText primary="Credenciadoras" />
        </ListItemButton>
      </Link>

      <Link href="/system/services" title="Serviços">
        <ListItemButton>
          <ListItemIcon>
            <Class />
          </ListItemIcon>
          <ListItemText primary="Serviços" />
        </ListItemButton>
      </Link>

      <Link href="/system/products" title="Produtos">
        <ListItemButton>
          <ListItemIcon>
            <ShoppingCart />
          </ListItemIcon>
          <ListItemText primary="Produtos" />
        </ListItemButton>
      </Link>

      <Link href="/system/groups" title="Grupos">
        <ListItemButton>
          <ListItemIcon>
            <Groups />
          </ListItemIcon>
          <ListItemText primary="Grupos" />
        </ListItemButton>
      </Link>

      <Link href="/system/beneficiaries" title="Beneficiários">
        <ListItemButton>
          <ListItemIcon>
            <Image src={Beneficiary} alt="logo" width={28} height={28} />
          </ListItemIcon>
          <ListItemText primary="Beneficiários" />
        </ListItemButton>
      </Link>

      <Link href="/system/users" title="Usuários">
        <ListItemButton>
          <ListItemIcon>
            <PersonAdd />
          </ListItemIcon>
          <ListItemText primary="Usuários" />
        </ListItemButton>
      </Link>
    </>
  )
}
