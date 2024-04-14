'use client'

import { ExternalLink, LinkIcon, LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import copy from 'clipboard-copy'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import type { Signatures } from '@/lib/api'
import { cn } from '@/lib/utils'
import SignatureDetails from './signature-details'

type SignaturesViewProps = {
  signatures: Signatures
  queryParams: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  creationData: any
  creations?: boolean
}

export default function SignaturesView({
  signatures,
  queryParams,
  creationData,
  creations
}: SignaturesViewProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [isShareLoading, setIsShareLoading] = useState(false)

  async function shareConfiguration() {
    try {
      await copy(`https://particles-on-canvas.vercel.app/create${queryParams}`)

      toast({
        className: 'rounded-none p-2',
        description: 'link copied to clipboard!'
      })
    } catch {
      toast({
        variant: 'destructive',
        className: 'rounded-none p-2',
        description: 'an error occurred, please try again!'
      })
    }
  }

  function handleSave() {
    setIsShareLoading(true)

    const { combinedVelocity, layerDimensions, strategy } = signatures

    localStorage.setItem(
      '__poc_new_creation',
      JSON.stringify({
        combinedVelocity,
        layerDimensions,
        strategy
      })
    )

    localStorage.setItem('__poc_creation_signatures_count', signatures.signatures.length.toString())
    signatures.signatures.forEach((signature, i) => {
      localStorage.setItem(
        `__poc_creation_signature_${i}`,
        JSON.stringify({
          image: signature.image,
          seed: signature.seed
        })
      )
    })

    localStorage.setItem('__poc_creation_query', queryParams)
    localStorage.setItem('__poc_creation_data', JSON.stringify(creationData))

    router.push('/creations/new')
  }

  return (
    <div className={cn('flex flex-col gap-y-6', creations ? 'flex-col-reverse w-full' : '')}>
      <div className="w-full flex flex-col gap-y-4">
        <p className="text-sm text-muted-foreground">signatures</p>
        <div className="flex flex-col gap-y-6">
          {signatures.signatures.map(({ image, seed }, i) => (
            <div key={seed} className="flex flex-col w-full gap-y-8">
              <div className="flex items-start flex-col w-full gap-y-4">
                <img
                  className="max-w-full max-h-full"
                  src={`${!creations ? 'data:image/png;base64,' : ''}${image}`}
                />
                <div className="w-full flex flex-col gap-y-3">
                  <Link
                    target="_blank"
                    referrerPolicy="no-referrer"
                    href={`${!creations ? 'data:image/png;base64,' : ''}${image}`}
                    className="w-40"
                  >
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
                    <p className="text-sm text-muted-foreground md:max-w-52 tracking-tight break-words">
                      {seed}
                    </p>
                  </div>
                </div>
              </div>
              {i !== signatures.signatures.length - 1 && <hr className="min-w-full" />}
            </div>
          ))}
          <div className="flex md:flex-row gap-x-4 flex-col gap-y-4">
            {!creations && (
              <Button
                onClick={shareConfiguration}
                variant={'secondary'}
                type={'button'}
                className="dark:border-muted px-4 w-[12.35rem] shadow-none bg-background hover:bg-background flex h-9 items-center justify-start gap-x-2 rounded-none border border-neutral-200"
              >
                share configuration <LinkIcon height={16} width={16} />
              </Button>
            )}
            {!pathname.includes('creations') && (
              <Button
                disabled={isShareLoading}
                onClick={handleSave}
                type={'button'}
                className="rounded-none shadow-none hover:bg-foreground w-60"
              >
                {isShareLoading ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  'save to community creations'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
      {!creations && <SignatureDetails signatures={signatures} />}
    </div>
  )
}
