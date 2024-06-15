import { DateTime } from 'luxon'

import Layout from '@/components/layout'
import { createClient } from '@/utils/supabase/client'
import type { Signature } from '../page'
import ShareSection from './share-section'
import SignaturesView from '@/app/components/signatures-view'
import SignatureDetails from '@/app/components/signature-details'

type SignatureCreationProps = {
  id: string
}

export default async function SignatureCreation({ id }: SignatureCreationProps) {
  const supabase = createClient()
  const { data, error } = await supabase.from('signatures').select().eq('id', id)

  if (error) {
    return <></>
  }

  const signature = data[0] as Signature

  return (
    <Layout className="h-full w-full">
      <div className="flex min-h-[68vh] w-full items-start justify-center py-10">
        <main className="flex w-full xl:flex-row flex-col-reverse items-start justify-center gap-x-28 gap-y-10 text-lg font-light px-6 tracking-tighter md:max-w-7xl md:justify-start">
          <div className="flex md:mt-0 -mt-6 flex-col gap-y-4 md:max-w-52 max-w-full">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">name</p>
              <p className="text-sm font-semibold tracking-tight lowercase">
                {signature.creation_name ? signature.creation_name : signature.id.split('-')[0]}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">created by</p>
              <p className="text-sm font-semibold tracking-tight">
                {signature.creator_first_name.toLowerCase()}{' '}
                {signature.creator_last_name.toLowerCase()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">date</p>
              <p className="text-sm font-semibold tracking-tight">
                {DateTime.fromISO(signature.created_at)
                  .toLocaleString(DateTime.DATE_MED)
                  .toLowerCase()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                particles <br />
                [velocity (cm/ps), priority]
              </p>
              <div className="text-sm flex flex-col gap-y-1 font-semibold tracking-tight">
                {signature.particles.map((particle, i) => (
                  <p key={`particle-data-${i}`}>
                    {particle.particle}
                    <br />
                    <span className="text-muted-foreground">
                      [<span className="text-foreground">{particle.velocity}</span> (
                      {((particle.velocity * 100) / 0.0299792458).toFixed(1)}% of c),{' '}
                      <span className="text-foreground">#{particle.priority}</span>]
                    </span>
                  </p>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">dimensions (px)</p>
              <p className="text-sm font-semibold tracking-tight">
                {signature.width}x{signature.height}
              </p>
            </div>
            <div className="flex flex-row gap-x-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">symmetry</p>
                <p className="text-sm font-semibold tracking-tight">
                  {signature.symmetry ? 'on' : 'off'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">trig</p>
                <p className="text-sm font-semibold tracking-tight">
                  {signature.trig ? 'on' : 'off'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">alpha</p>
                <p className="text-sm font-semibold tracking-tight">
                  {signature.alpha ? 'on' : 'off'}
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-x-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">noise</p>
                <p className="text-sm font-semibold tracking-tight">
                  {signature.noise ? 'on' : 'off'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">activation</p>
                <p className="text-sm font-semibold tracking-tight">{signature.activation}</p>
              </div>
            </div>
            <SignatureDetails
              signatures={{
                combinedVelocity: signature.combined_velocity,
                layerDimensions: signature.layer_dimensions,
                strategy: signature.strategy,
                signatures: signature.signatures.map((signature) => ({
                  seed: signature.substring(signature.lastIndexOf('/') + 1).split('.')[0],
                  image: signature
                }))
              }}
              creations
            />
            <ShareSection signature={signature} />
          </div>
          <article className="flex w-full flex-col items-start gap-y-4 md:pb-10 md:w-[40rem] lg:w-[50rem]">
            <SignaturesView
              creationData={{}}
              queryParams={signature.creation_query}
              signatures={{
                combinedVelocity: signature.combined_velocity,
                layerDimensions: signature.layer_dimensions,
                strategy: signature.strategy,
                signatures: signature.signatures.map((signature) => ({
                  seed: signature.substring(signature.lastIndexOf('/') + 1).split('.')[0],
                  image: signature
                }))
              }}
              creations
            />
          </article>
        </main>
      </div>
    </Layout>
  )
}
