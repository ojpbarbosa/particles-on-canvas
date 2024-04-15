import type { Metadata } from 'next'

import Creations from './components/creations'

export const metadata: Metadata = {
  title: 'PARTICLES ON CANVAS - CREATIONS'
}

export const revalidate = 0

export default function CreationsPage() {
  return <Creations />
}
