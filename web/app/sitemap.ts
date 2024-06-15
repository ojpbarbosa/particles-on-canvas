import { createClient } from '@/utils/supabase/client'
import type { Signature } from './creations/[id]/page'

export default async function sitemap() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('signatures')
    .select('*', { count: 'estimated' })
    .order('created_at', { ascending: false })

  let creations: { url: string; lastModified: string }[] = []
  if (!error) {
    creations = (data as Signature[]).map((signature) => ({
      url: `https://particles.joaobarbosa.space/creations/${signature.id}`,
      lastModified: new Date(signature.created_at).toISOString().split('T')[0]
    }))
  }

  const routes = ['', '/gallery', '/creations', '/create', '/paper', '/mission', '/contact'].map(
    (route) => ({
      url: `https://particles.joaobarbosa.space${route}`,
      lastModified: new Date().toISOString().split('T')[0]
    })
  )

  return [...routes, ...creations]
}
