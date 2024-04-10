import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/react'

import '@/styles/globals.css'
import Providers from './providers'
import Icon from '@/public/favicon.ico'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Particles on Canvas',
  description: 'Creating digital art to further scientific divulgation',
  icons: [{ rel: 'icon', url: Icon.src }]
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
        <Analytics />
      </body>
    </html>
  )
}
