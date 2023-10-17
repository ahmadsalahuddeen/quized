'use client'
import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider as NextThemesProvider, ThemeProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

type Props = {
  children: React.ReactNode
}
const queryClient = new QueryClient()


const Providers = ({ children, ...props }: ThemeProviderProps) => {
  return (
<QueryClientProvider client={queryClient}>

    <ThemeProvider attribute='class' defaultTheme='system' enableSystem >
      <SessionProvider>{children}</SessionProvider>

    </ThemeProvider>
</QueryClientProvider>
  )
}

export default Providers