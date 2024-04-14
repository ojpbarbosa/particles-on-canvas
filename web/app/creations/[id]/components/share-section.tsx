'use client'

import copy from 'clipboard-copy'

import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import type { Signature } from '../page'
import Link from 'next/link'
import { LinkIcon } from 'lucide-react'

type ShareSectionProps = {
  signature: Signature
}

export default function ShareSection({ signature }: ShareSectionProps) {
  async function shareConfiguration() {
    try {
      await copy(`https://particles-on-canvas.vercel.app/create${signature.creation_query}`)

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

  async function shareCreation() {
    try {
      await copy(`https://particles-on-canvas.vercel.app/creations/${signature.id}`)

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

  return (
    <>
      <Button
        onClick={shareConfiguration}
        variant={'secondary'}
        className="dark:border-muted px-4 w-[12.35rem] shadow-none bg-background hover:bg-background flex h-9 items-center justify-start gap-x-2 rounded-none border border-neutral-200"
      >
        share configuration <LinkIcon height={16} width={16} />
      </Button>

      <Button
        onClick={shareCreation}
        variant={'secondary'}
        className="dark:border-muted px-4 w-40 shadow-none bg-background hover:bg-background flex h-9 items-center justify-start gap-x-2 rounded-none border border-neutral-200"
      >
        share creation
        <LinkIcon height={16} width={16} />
      </Button>
      <Link href={`https://particles-on-canvas.vercel.app/create${signature.creation_query}`}>
        <Button className="hover:bg-foreground bg-foreground text-background rounded-none flex h-9 flex-row gap-x-1 border">
          create copy
        </Button>
      </Link>
    </>
  )
}
