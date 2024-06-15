import Link from 'next/link'

import Layout from '@/components/layout'
import { createClient } from '@/utils/supabase/client'
import type { Signature } from '../[id]/page'

export default async function Creations() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('signatures')
    .select('*', { count: 'estimated' })
    .order('created_at', { ascending: false })

  if (error) {
    return <></>
  }

  const signatures = data as Signature[]

  return (
    <Layout>
      <main className="flex min-h-screen flex-col items-center justify-between py-10 px-6 md:p-24">
        <div className="z-10 max-w-5xl gap-10 w-full font-light grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 text-sm">
          {signatures
            .filter((signature) => signature.public)
            .map((signature, i) => {
              return (
                <div key={`signature-${i}`} className="space-y-2">
                  <img src={signature.signatures[0]} alt={`creation ${i + 1}.`} />
                  <div className="lowercase flex flex-col">
                    <p>
                      {signature.creation_name
                        ? signature.creation_name
                        : signature.id.split('-')[0]}{' '}
                      <Link
                        href={`/creations/${signature.id}`}
                        className="text-muted-foreground hover:underline underline-offset-4"
                      >
                        by {signature.creator_first_name}
                      </Link>
                    </p>
                    <Link
                      href={`/creations/${signature.id}`}
                      className="text-muted-foreground w-24 hover:underline underline-offset-4"
                    >
                      see details
                    </Link>
                  </div>
                </div>
              )
            })}
        </div>
      </main>
    </Layout>
  )
}
