'use client'

import type { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import NextAdapterApp from 'next-query-params/app'
import { QueryParamProvider } from 'use-query-params'

type ProvidersProps = {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryParamProvider adapter={NextAdapterApp}>
      <ThemeProvider attribute="class" storageKey="theme" enableColorScheme enableSystem>
        {children}
      </ThemeProvider>
    </QueryParamProvider>
  )
}
