import type { Metadata } from 'next'

import About from './components/about'

export const metadata: Metadata = {
  title: 'PARTICLES ON CANVAS - ABOUT'
}

export default function AboutPage() {
  return <About />
}
