'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { FaGithub } from 'react-icons/fa6'
import { usePathname } from 'next/navigation'

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
  },
  {
    url: '/contact',
    label: 'contact'
  }
]

export default function Footer() {
  const { theme, setTheme } = useTheme()

  const pathname = usePathname()

  return (
    <footer className="dark:border-muted z-40 flex w-full shrink-0 flex-col items-start gap-2 border-t border-neutral-200 px-0.5 py-6 sm:flex-col md:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start justify-start gap-x-14 gap-y-6 px-6 md:max-w-7xl md:flex-row">
        <div className="flex h-full w-full justify-between gap-y-14 md:w-auto md:flex-col md:items-start">
          <Link href="/" className="flex h-full">
            PARTICLES ON CANVAS
          </Link>

          <Link
            href="https://github.com/ojpbarbosa/particles-on-canvas"
            rel="noreferrer"
            target="_blank"
            className="flex h-full"
          >
            <FaGithub className="text-2xl" />
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row gap-x-8 gap-y-8">
          <div className="flex gap-x-8">
            <div className="flex min-w-28 flex-col gap-y-3">
              <ul className="flex flex-col items-start gap-y-3">
                {links.map((link, i) => (
                  <li key={`desktop-footer-ref-${i}`}>
                    <Link
                      className={cn(
                        'text-muted-foreground hover:text-foreground flex h-4 items-center text-sm font-normal transition-colors duration-200',
                        (pathname === link.url ||
                          pathname.replace('/', '').toLowerCase() === link.label) &&
                          'text-foreground underline underline-offset-4'
                      )}
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
                        'text-muted- hover:text-foreground flex h-4 cursor-pointer items-center text-sm font-normal transition-colors duration-200',
                        theme === 'light' && 'text-foreground underline underline-offset-4'
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
                        theme === 'dark' && 'text-foreground underline underline-offset-4'
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
                        theme === 'system' && 'text-foreground underline underline-offset-4'
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
            <p className="text-muted-foreground -mt-1 text-sm font-normal">
              this project is still highly experimental.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
