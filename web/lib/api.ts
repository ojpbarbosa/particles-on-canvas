import type { ParticleData } from '@/app/create/components/create'

const NGROK_SERVICE_URL = process.env.NEXT_PUBLIC_NGROK_SERVICE_URL!
const PRODUCTION_SERVICE_URL = process.env.NEXT_PUBLIC_PRODUCTION_SERVICE_URL!

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchWithTimeout(resource: string, options: any = {}) {
  const { timeout = 5 * 1000 * 60 } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  })
  clearTimeout(timeoutId)

  return response
}

async function getService(): Promise<string> {
  try {
    if (NGROK_SERVICE_URL) {
      await fetchWithTimeout(`${NGROK_SERVICE_URL}/heartbeat`, {
        method: 'GET',
        timeout: 3 * 1000
      })

      return NGROK_SERVICE_URL
    }

    await fetch(`${PRODUCTION_SERVICE_URL}/heartbeat`, {
      method: 'GET'
    })

    return PRODUCTION_SERVICE_URL
  } catch {
    throw new Error('Could not reach service')
  }
}

export async function createSignatures(body: CreateSignaturesBody): Promise<Signatures> {
  const currentService = await getService()
  const response = await fetch(`${currentService}/signatures/create`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const data = await response.json()
  return data
}

export async function heartbeat() {
  await getService()
}
