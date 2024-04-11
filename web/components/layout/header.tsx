'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useWindowSize } from 'react-use'

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

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className={cn('sticky top-0 z-50 h-14 transition-all duration-200 ease-linear')}>
      <header>
        <nav className="mx-auto flex h-[52px] w-full max-w-5xl flex-row justify-between gap-x-4 px-6 py-2 md:max-w-7xl md:gap-x-10 ">
          <Link
            className="flex items-center justify-center w-72 text-background backdrop-invert z-20"
            href="/"
          >
            PARTICLES ON CANVAS
          </Link>
          <div className="hidden w-full justify-end md:justify-between sm:flex">
            <div className="flex items-center gap-3 sm:gap-6 bg-background px-4">
              {links.map((link, i) => {
                return (
                  <Link
                    key={`header-ref-${i}`}
                    className="text-muted-foreground hover:text-foreground flex h-0 items-center text-sm font-normal transition-colors duration-200"
                    href={link.url}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex sm:hidden">
            <Button
              className="bg-transparent dark:bg-transparent dark:hover:bg-transparent"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">open menu</span>
              <Menu className="text-foreground" />
            </Button>
          </div>
        </nav>
      </header>
      {isMobileMenuOpen ? (
        <div className="flex flex-col w-auto mx-4 mt-2 justify-end items-start gap-y-6 bg-background rounded z-50 p-2 py-4 transition-all duration-200 ease-linear border border-border">
          {links.map((link, i) => {
            return (
              <Link
                key={`header-ref-${i}`}
                className="text-foreground-muted hover:text-foreground flex h-0 items-center text-sm font-normal transition-colors duration-200"
                href={link.url}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}