import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import SignatureCreation from './components/signature-creation'
import { createClient } from '@/utils/supabase/client'

type CreationPageProps = { params: { id: string } }

export type Signature = {
  id: string
  created_at: string
  creation_query: string
  combined_velocity: number
  signatures: string[]
  strategy: string
  creator_first_name: string
  creator_last_name: string
  creator_email: string
  public: boolean
  layer_dimensions: number[]
  creation_name: string
  images: number
  height: number
  width: number
  symmetry: boolean
  trig: boolean
  alpha: boolean
  noise: boolean
  particles: { velocity: number; particle: string; priority: number }[]
  activation: string
}

export async function generateMetadata({ params }: CreationPageProps): Promise<Metadata> {
  const supabase = createClient()
  const { data, error } = await supabase.from('signatures').select().eq('id', params.id)

  if (error || !data) {
    notFound()
  }

  const { id, creation_name: creationName } = data![0] as Signature

  const displayName = creationName ? creationName.toUpperCase() : id.split('-')[0].toUpperCase()
  const authorFullName = `${data![0].creator_first_name} ${data![0].creator_last_name}`

  return {
    title: `PARTICLES ON CANVAS - CREATION ${displayName}`,
    description: `A particle signature by ${authorFullName}.`,
    icons: [
      {
        url: data![0].signatures[0],
        type: 'image/png',
        rel: 'icon'
      }
    ],
    openGraph: {
      title: `PARTICLES ON CANVAS - CREATION ${displayName}`,
      description: `A particle signature by ${authorFullName}.`,
      type: 'article',
      url: `https://https://particles.joaobarbosa.space/creations/${id}`,
      images: [
        {
          url: data![0].signatures[0],
          width: data![0].width,
          height: data![0].height,
          alt: `PARTICLES ON CANVAS - CREATION ${displayName}`
        }
      ]
    }
  }
}

export const revalidate = 0

export default function CreationPage({ params: { id } }: CreationPageProps) {
  return <SignatureCreation id={id} />
}
