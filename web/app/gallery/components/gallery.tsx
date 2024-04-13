import Image, { StaticImageData } from 'next/image'

import Link from 'next/link'
import slugify from 'slugify'

import Layout from '@/components/layout'
import { fisherYatesShuffle } from '@/lib/utils'
import AuroraBorealis from '@/public/gallery/aurora-borealis.jpeg'
import ParticlesDance from '@/public/gallery/particles-dance.jpeg'
import QuantumSuperposition from '@/public/gallery/quantum-superposition.jpeg'
import SeeingTheInvisible from '@/public/gallery/seeing-the-invisible.jpeg'
import TheFluidEssence from '@/public/gallery/the-fluid-essence.jpeg'
import TheOne from '@/public/gallery/the-one.jpeg'
import ThePurplePaleBlueDot from '@/public/gallery/the-purple-pale-blue-dot.jpeg'
import WavesOfTheDreamer from '@/public/gallery/waves-of-the-dreamer.jpeg'

const gallery = [
  {
    image: ParticlesDance
  },
  {
    image: QuantumSuperposition,
    label: 'quatum superposition: penguin or crow?'
  },
  {
    image: SeeingTheInvisible
  },
  {
    image: TheFluidEssence
  },
  {
    image: ThePurplePaleBlueDot,
    label: 'the purple-pale blue dot'
  },
  {
    image: WavesOfTheDreamer
  }
]

export default function Gallery() {
  function extractSignatureNameAndSlug(signature: { image: StaticImageData; label?: string }) {
    let signatureName = ''
    let signatureSlug = ''

    if (signature.label) {
      signatureName = signature.label
    }

    const match = signature.image.src.match(/\/([^\/]+)\/([^\/]+)\.jpeg$/)
    if (match && match.length > 2) {
      const result = match[2].split('.')[0].split('-').join(' ').trim()

      signatureSlug = result

      if (!signatureName) {
        signatureName = result
      }
    }

    return [signatureName, slugify(signatureSlug, { remove: /:,?/g })]
  }

  return (
    <Layout>
      <main className="flex min-h-screen flex-col items-center justify-between py-10 px-6 md:p-24">
        <div className="z-10 max-w-5xl gap-10 w-full font-light grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 text-sm">
          {[
            {
              image: TheOne,
              label: '#1'
            },
            {
              image: AuroraBorealis
            },
            ...fisherYatesShuffle(gallery)
          ].map((signature, i) => {
            const [name, slug] = extractSignatureNameAndSlug(signature)

            return (
              <div key={`signature-${i}`} className="space-y-2">
                <Link href={`/gallery/${slug}`}>
                  <Image src={signature.image} alt={`signature ${i + 1}.`} />
                </Link>
                <p className="lowercase">
                  {name}{' '}
                  <Link
                    href={`/gallery/${slug}`}
                    className="text-muted-foreground hover:underline underline-offset-4"
                  >
                    see details
                  </Link>
                </p>
              </div>
            )
          })}
        </div>
      </main>
    </Layout>
  )
}
