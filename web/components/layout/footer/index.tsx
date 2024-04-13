'use client'

import Link from 'next/link'
import { FaGithub } from 'react-icons/fa6'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import Version from './version'
import Theme from './theme'

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
    url: '/create',
    label: 'create'
  },
  {
    url: '/about',
    label: 'about'
  },
  {
    url: '/contact',
    label: 'contact'
  }
]

export default function Footer() {
  const pathname = usePathname()

  return (
    <footer className="dark:border-muted z-40 flex w-full shrink-0 flex-col items-start gap-2 border-t border-neutral-200 px-0.5 pt-6 pb-14 sm:flex-col md:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start justify-start gap-x-14 gap-y-6 px-6 md:max-w-7xl md:flex-row">
        <div className="flex h-full md:h-40 w-full justify-between gap-y-14 md:w-auto md:flex-col md:items-start">
          <div className="flex flex-col gap-y-1">
            <Link href="/" className="flex h-full">
              PARTICLES ON CANVAS
            </Link>
            <p className="text-xs md:text-sm text-muted-foreground">
              © {new Date().getFullYear()}
            </p>
          </div>

          <Link
            href="https://github.com/ojpbarbosa/particles-on-canvas"
            rel="noreferrer"
            target="_blank"
            className="flex h-full md:mt-0 mt-0.5 text-muted-foreground hover:text-foreground transition-colors duration-100 md:items-end"
          >
            <FaGithub className="text-xl" />
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row gap-x-8 gap-y-8">
          <div className="flex gap-x-8">
            <div className="flex flex-col gap-y-3">
              <h4 className="text-sm h-4 font-medium">sections</h4>
              <ul className="flex flex-col items-start gap-y-3">
                {links.map((link, i) => (
                  <li key={`desktop-footer-ref-${i}`}>
                    <Link
                      className={cn(
                        'text-muted-foreground hover:text-foreground flex h-4 items-center text-sm font-normal transition-colors duration-200',
                        (pathname === link.url ||
                          pathname.replace('/', '').toLowerCase().includes(link.label)) &&
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
            <h4 className="text-sm font-medium h-4">theme</h4>
            <Theme />
          </div>
          <div className="flex flex-col gap-y-3">
            <div className="flex flex-col gap-y-3">
              <h4 className="text-sm h-4 font-medium">disclaimer</h4>
              <p className="text-muted-foreground -mt-1 text-sm font-normal">
                this project is still highly experimental <Version />.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
