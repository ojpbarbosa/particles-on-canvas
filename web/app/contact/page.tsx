import type { Metadata } from 'next'

import Contact from './components/contact'

export const metadata: Metadata = {
  title: 'PARTICLES ON CANVAS - CONTACT'
}

export default function ContactPage() {
  return <Contact />
}
