import React from 'react'
import { SessionProviders } from 'next-auth/next'

type Props = {
  children: React.ReactNode
}

const Providers = ({ children }: Props) => {
  return (
    <SessionProviders>{children}</SessionProviders>
  )
}

export default Providers