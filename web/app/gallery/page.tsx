import type { Metadata } from 'next'

import Gallery from './components/gallery'

export const metadata: Metadata = {
  title: 'PARTICLES ON CANVAS - GALLERY'
}

export default function GalleryPage() {
  return <Gallery />
}
