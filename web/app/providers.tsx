'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'

type ProvidersProps = {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" storageKey="theme" enableColorScheme enableSystem>
      {children}
    </ThemeProvider>
  )
}
