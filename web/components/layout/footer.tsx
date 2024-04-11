'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useWindowSize } from 'react-use'

import { cn } from '@/lib/utils'

const links = [
  {
    url: '/',
    label: 'gallery'
  },
  {
    url: '/paper',
    label: 'paper'
  },
  {
    url: '/generator',
    label: 'generator'
  }
]

export default function Footer() {
  const { theme, setTheme } = useTheme()
  const size = useWindowSize()

  return (
    <footer className="dark:border-muted z-40 flex w-full shrink-0 flex-col items-start gap-2 border-t border-neutral-200 px-0.5 py-6 sm:flex-col md:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start justify-start gap-x-14 gap-y-6 px-6 md:max-w-7xl md:flex-row">
        <div className="flex h-full w-full justify-between gap-y-14 md:w-auto md:flex-col md:items-start">
          <Link href="/" className="flex h-full">
            PARTICLES ON CANVAS
          </Link>
        </div>
        {size.width > 768 && (
          <div className="flex flex-row gap-x-8">
            <div className="flex gap-x-8">
              <div className="flex min-w-28 flex-col gap-y-3">
                <ul className="flex flex-col items-start gap-y-3">
                  {links.map((link, i) => (
                    <li key={`desktop-footer-ref-${i}`}>
                      <Link
                        className="text-muted-foreground hover:text-foreground flex h-4 items-center text-sm font-normal transition-colors duration-200"
                        href={link.url}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col gap-y-3">
              <h4 className="font-sans-heading text-sm font-medium">theme</h4>
              {theme && (
                <div className="text-muted-foreground flex flex-row items-center gap-x-2">
                  <ul className="flex flex-col items-start gap-y-3">
                    <li>
                      <a
                        onClick={() => setTheme('light')}
                        className={cn(
                          'text-muted-foreground hover:text-foreground flex h-4 cursor-pointer items-center text-sm font-normal transition-colors duration-200',
                          theme === 'light' && 'text-foreground'
                        )}
                      >
                        light
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => setTheme('dark')}
                        className={cn(
                          'text-muted-foreground hover:text-foreground flex h-4 cursor-pointer items-center text-sm font-normal transition-colors duration-200',
                          theme === 'dark' && 'text-foreground'
                        )}
                      >
                        dark
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => setTheme('system')}
                        className={cn(
                          'text-muted-foreground hover:text-foreground flex h-4 cursor-pointer items-center text-sm font-normal transition-colors duration-200',
                          theme === 'system' && 'text-foreground'
                        )}
                      >
                        system
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-y-3">
              <h4 className="font-sans-heading text-sm font-medium">disclaimer</h4>
              <p className="text-muted-foreground -mt-1 text-sm font-normal"></p>
            </div>
          </div>
        )}
        {size.width <= 768 && (
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-3">
              <h4 className="font-sans-heading text-sm font-medium">disclaimer</h4>
              <p className="text-muted-foreground -mt-1 text-sm font-normal"></p>
            </div>
          </div>
        )}
      </div>
    </footer>
  )
}
