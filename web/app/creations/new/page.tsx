import type { Metadata } from 'next'

import New from './components/new'

export const metadata: Metadata = {
  title: 'PARTICLES ON CANVAS - CREATIONS - NEW'
}

export default function NewPage() {
  return <New />
}
