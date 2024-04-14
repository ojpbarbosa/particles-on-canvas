import type { ParticleData } from '@/app/create/components/create'

const SERVICE_URL = 'https://particles-on-canvas.onrender.com'

type CreateSignaturesBody = {
  width: number
  height: number
  images: number
  alpha: boolean
  symmetry: boolean
  trig: boolean
  noise: boolean
  activation: string
  particles: ParticleData[]
}

export type Signatures = {
  combinedVelocity: number
  layerDimensions: number[]
  signatures: {
    image: string
    seed: string
  }[]
  strategy: string
}

export async function createSignatures(body: CreateSignaturesBody): Promise<Signatures> {
  const response = await fetch(`${SERVICE_URL}/signatures/create`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const data = await response.json()
  return data
}
