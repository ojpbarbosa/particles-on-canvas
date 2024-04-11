import Image, { StaticImageData } from 'next/image'

import Layout from '@/components/layout'
import { fisherYatesShuffle } from '@/lib/utils'

import AuroraBorealis from '@/public/signatures/aurora-borealis.jpeg'
import ParticlesDance from '@/public/signatures/particles-dance.jpeg'
import QuantumSuperpositionPenguinCrow from '@/public/signatures/quantum-superposition-penguin-crow.jpeg'
import SeeingTheInvisible from '@/public/signatures/seeing-the-invisible.jpeg'
import TheFluidEssence from '@/public/signatures/the-fluid-essence.jpeg'
import TheOne from '@/public/signatures/the-one.jpeg'
import ThePurplePaleBlueDot from '@/public/signatures/the-purple-pale-blue-dot.jpeg'
import WavesOfTheDreamer from '@/public/signatures/waves-of-the-dreamer.jpeg'

const signatures = [
  {
    image: AuroraBorealis
  },
  {
    image: ParticlesDance
  },
  {
    image: QuantumSuperpositionPenguinCrow,
    label: 'Quatum Superposition - Penguin or Crow?'
  },
  {
    image: SeeingTheInvisible
  },
  {
    image: TheFluidEssence
  },
  {
    image: ThePurplePaleBlueDot
  },
  {
    image: WavesOfTheDreamer
  }
]

export default function Gallery() {
  function extractSignatureImageName(signature: { image: StaticImageData; label?: string }) {
    if (signature.label) {
      return signature.label
    }

    const match = signature.image.src.match(/\/([^\/]+)\/([^\/]+)\.jpeg$/)
    if (match && match.length > 2) {
      return match[2].split('.')[0].split('-').join(' ').trim()
    } else {
      return ''
    }
  }

  return (
    <Layout>
      <main className="flex min-h-screen flex-col items-center justify-between p-10 md:p-24">
        <div className="z-10 max-w-5xl gap-10 w-full font-light grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 text-sm">
          {[
            {
              image: TheOne,
              label: '#1'
            },
            ...fisherYatesShuffle(signatures)
          ].map((signature, i) => (
            <div key={`signature-${i}`} className="space-y-2">
              <Image src={signature.image} alt={`signature ${i + 1}.`} />
              <p>{extractSignatureImageName(signature).toLowerCase()}</p>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  )
}
