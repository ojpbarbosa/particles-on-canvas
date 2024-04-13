import type { Metadata } from 'next'

import Create from './components/create'

export const metadata: Metadata = {
  title: 'PARTICLES ON CANVAS - CREATE'
}

export default function CreatePage() {
  return <Create />
}
