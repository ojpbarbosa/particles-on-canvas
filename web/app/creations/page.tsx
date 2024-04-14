import type { Metadata } from 'next'

import Creations from './components/creations'

export const metadata: Metadata = {
  title: 'PARTICLES ON CANVAS - GALLERY - CREATIONS'
}

export default function CreationsPage() {
  return <Creations />
}
