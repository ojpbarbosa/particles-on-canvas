import type { Metadata } from 'next'

import Gallery from './gallery/components/gallery'

export const metadata: Metadata = {
  title: 'PARTICLES ON CANVAS - GALLERY'
}

export default function GalleryPage() {
  return <Gallery />
}
