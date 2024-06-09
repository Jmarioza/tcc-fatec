'use client'
import { ReactElement } from 'react'
import { Box, Toolbar, Container } from '@mui/material'
import { Header } from '@/components/Header'
import { AsideListItens } from './components/Aside'
import { AccreditorProvider } from '@/contexts/AccreditorContext'
import { AccreditorSelect } from '@/components/AccreditorSelect'

export default function AdminLayout({ children }: { children: ReactElement }) {
  return (
    <AccreditorProvider>
      <Box sx={{ display: 'flex' }}>
        <Header title="Painel de Controle - Clientes">
          <AsideListItens />
        </Header>
        <Box
          component="main"
          sx={{
            backgroundColor: '#f9f9f9',
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="xl" className="bg-white">
            <AccreditorSelect />
            {children}
          </Container>
        </Box>
      </Box>
    </AccreditorProvider>
  )
}
