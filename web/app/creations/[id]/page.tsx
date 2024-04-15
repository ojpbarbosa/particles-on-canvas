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

  return {
    title: `PARTICLES ON CANVAS - CREATIONS - ${creationName ? creationName.toUpperCase() : id.split('-')[0].toUpperCase()}`
  }
}

export const revalidate = 0

export default function CreationPage({ params: { id } }: CreationPageProps) {
  return <SignatureCreation id={id} />
}
