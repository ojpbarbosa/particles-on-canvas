import { use } from 'react'

import { getVersion } from '@/lib/version'

export default function Version() {
  const version = use(getVersion())

  return <>(v{version})</>
}
