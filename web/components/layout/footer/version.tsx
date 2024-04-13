import { useEffect, useState } from 'react'

import { getVersion } from '@/lib/version'

export default function Version() {
  const [version, setVersion] = useState('0.0.0')

  useEffect(() => {
    getVersion().then(setVersion)
  }, [])

  return <>(v{version})</>
}
