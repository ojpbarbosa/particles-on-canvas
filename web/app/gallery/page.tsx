import { Metadata } from 'next'

import Gallery from '@/app/components/gallery'

export const metadata: Metadata = {
  title: 'PARTICLES ON CANVAS - GALLERY'
}

export default function GalleryPage() {
  return <Gallery />
}
