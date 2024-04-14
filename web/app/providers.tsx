'use client'

import { type ReactNode, Suspense } from 'react'
import { ThemeProvider } from 'next-themes'
import NextAdapterApp from 'next-query-params/app'
import { QueryParamProvider } from 'use-query-params'

type ProvidersProps = {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <Suspense>
      <QueryParamProvider adapter={NextAdapterApp}>
        <ThemeProvider attribute="class" storageKey="theme" enableColorScheme enableSystem>
          {children}
        </ThemeProvider>
      </QueryParamProvider>
    </Suspense>
  )
}
