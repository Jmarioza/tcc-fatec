'use client'
import { useState, ReactElement } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { AppBar } from '@/components/AppBar'
import { Drawer } from '@/components/Drawer'

interface Props {
  title: string
  children: ReactElement
}

export function Header({ title, children }: Props) {
  const [open, setOpen] = useState(false)
  const { signOut } = useAuth()

  return (
    <>
      <AppBar
        signOut={signOut}
        title={title}
        open={open}
        toggleOpen={() => setOpen(!open)}
      />
      <Drawer open={open} toggleOpen={() => setOpen(!open)}>
        {children}
      </Drawer>
    </>
  )
}
