import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/react'

import '@/styles/globals.css'
import Providers from './providers'
import Icon from '@/public/favicon.ico'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'PARTICLES ON CANVAS',
  description: 'Creating digital art to further scientific divulgation',
  icons: [{ rel: 'icon', url: Icon.src }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  },
  verification: {
    google: 'YY802qWK9pKmbSRmPjxpDn9sJ8BO4-2-UB94eC9HQO0'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'bg-background font-foreground font-mono min-h-screen antialiased',
          GeistMono.variable
        )}
      >
        <Providers>{children}</Providers>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
