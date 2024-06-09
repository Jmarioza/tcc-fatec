import { ReactElement } from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ContextProvider } from './Context'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: ' Crédito',
  description: 'Controle o Crédito de Co-Participação de seu Estabelecimento.',
}

export default function RootLayout({ children }: { children: ReactElement }) {
  return (
    <html lang="ptBR">
      <body className={inter.className}>
        <ContextProvider>{children}</ContextProvider>
      </body>
    </html>
  )
}
