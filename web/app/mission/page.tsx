import type { Metadata } from 'next'

import Mission from './components/mission'

export const metadata: Metadata = {
  title: 'PARTICLES ON CANVAS - MISSION'
}

export default function MissionPage() {
  return <Mission />
}
