import { Metadata } from 'next'

import Generator from './components/generator'

export const metadata: Metadata = {
  title: 'PARTICLES ON CANVAS - GENERATOR'
}

export default function GeneratorPage() {
  return <Generator />
}
