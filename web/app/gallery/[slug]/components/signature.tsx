import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

import Layout from '@/components/layout'
import { Button } from '@/components/ui/button'
import { getSignature } from '@/lib/content'
import crypto from 'crypto'

export const dynamic = 'force-static'

type SignatureProps = {
  slug: string
}

export default async function Signature({ slug }: SignatureProps) {
  const signature = (await getSignature(slug))!
  const seed = crypto
    .createHash('sha512')
    .update(signature.image + signature.velocity + signature.particles)
    .digest('hex')

  return (
    <Layout className="h-full w-full justify-start">
      <div className="flex min-h-[75vh] w-full items-start justify-center py-10">
        <main className="flex w-full xl:flex-row flex-col-reverse items-start justify-center gap-x-28 gap-y-10 text-lg font-light px-6 tracking-tighter md:max-w-7xl md:justify-start">
          <div className="flex flex-col gap-y-4 md:max-w-52 max-w-full">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">name</p>
              <p className="text-sm font-semibold tracking-tight">{signature.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">interpreted by</p>
              <p className="text-sm font-semibold tracking-tight">{signature.interpreter}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">velocity (cm per ps)</p>
              <p className="text-sm font-semibold tracking-tight">{signature.velocity}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">particles</p>
              <p className="text-sm font-semibold tracking-tight">{signature.particles}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">dimensions</p>
              <p className="text-sm font-semibold tracking-tight">{signature.resolution}</p>
            </div>
            <Link href={signature.image} className="w-40">
              <Button
                className="dark:border-muted px-4 shadow-none bg-background hover:bg-background flex h-9 items-center justify-start gap-x-2 rounded-none border border-neutral-200"
                variant={'secondary'}
              >
                view image source
                <ExternalLink height={16} width={16} />
              </Button>
            </Link>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">seed</p>
              <p className="text-sm text-muted-foreground tracking-tight break-words">{seed}</p>
            </div>
          </div>
          <article className="flex w-full flex-col items-start gap-y-4 md:pb-10 md:w-[40rem] lg:w-[50rem]">
            <Image src={signature.image} alt={signature.name} width={512} height={512} />
          </article>
        </main>
      </div>
    </Layout>
  )
}
