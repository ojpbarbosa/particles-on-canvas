import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import Signature from './components/singature'
import { getSignatures } from '@/lib/content'

export const dynamic = 'force-static'

type SignaturePageProps = { params: { slug: string } }

export async function generateMetadata({ params }: SignaturePageProps): Promise<Metadata> {
  const signature = (await getSignatures()).find((signature) => {
    return signature.slug === params.slug
  })!

  if (!signature) {
    notFound()
  }

  const { name } = signature

  return {
    title: `PARTICLES ON CANVAS - ${name.toUpperCase()}`
  }
}

export async function generateStaticParams() {
  return (await getSignatures()).map(({ slug }) => ({
    slug
  }))
}

export default function SignaturePage({ params: { slug } }: SignaturePageProps) {
  return <Signature slug={slug} />
}
