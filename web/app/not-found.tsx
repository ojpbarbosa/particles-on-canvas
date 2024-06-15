import type { Metadata } from 'next'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Layout from '@/components/layout'

export const metadata: Metadata = {
  title: 'PARTICLES ON CANVAS - 404'
}

export default function NotFoundPage() {
  return (
    <Layout className="justify-between">
      <main className="bg-background grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex flex-col text-center">
          <p className="text-muted-foreground text-base font-semibold">404</p>
          <h2 className="mt-4 h-14 text-3xl font-semibold tracking-tighter sm:text-4xl xl:text-5xl/none">
            page not found
          </h2>
          <p className="text-muted-foreground mt-4 text-sm leading-7">
            oops! it seems you{"'"}ve encountered a quantum fluctuation.
          </p>
          <div className="mt-6 flex sm:flex-row flex-col gap-y-4 items-center justify-center gap-x-4">
            <Link href="/gallery">
              <Button className="hover:bg-foreground bg-foreground text-background rounded-none flex h-9 flex-row gap-x-1 border">
                go back to gallery
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                className="dark:border-muted bg-background hover:bg-background h-9 rounded-none border border-neutral-200"
                variant={'secondary'}
              >
                contact us
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  )
}
