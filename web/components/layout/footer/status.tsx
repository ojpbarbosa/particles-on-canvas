import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import { heartbeat } from '@/lib/api'

export default function Status() {
  const [status, setStatus] = useState('experiencing downtime')
  const [accelerated, setAccelarated] = useState(false)

  useEffect(() => {
    heartbeat()
      .then((type) => {
        setStatus('all systems operational')

        if (type === 'ngrok') {
          setAccelarated(true)
        }
      })
      .catch(() => setStatus('down'))
  }, [])

  const statusStyle: { [key: string]: string } = {
    'experiencing downtime': 'bg-orange-500',
    'all systems operational': 'bg-green-500',
    down: 'bg-red-500'
  }

  const accelerationStyle = accelerated ? 'bg-blue-500' : 'bg-muted-foreground'

  return (
    <div className="flex flex-col gap-y-3">
      <h4 className="text-sm font-medium h-4">status</h4>
      <div className="text-muted-foreground h-4 flex flex-row items-center justify-start gap-x-2">
        <div
          className={cn(
            "before:'' h-2 w-2 rounded-full mt-[2px] transition-colors duration-1000",
            statusStyle[status]
          )}
        />
        <p className="h-4 flex items-center text-sm font-normal transition-colors duration-200">
          {status}
        </p>
      </div>
      <div className="text-muted-foreground h-4 flex flex-row items-center justify-start gap-x-2">
        <div
          className={cn(
            "before:'' h-2 w-2 rounded-full mt-[2px] transition-colors duration-1000",
            accelerationStyle
          )}
        />
        <p className="h-4 flex items-center text-sm font-normal transition-colors duration-200">
          {accelerated ? <>using hardware acceleration</> : <>using standard hardware</>}
        </p>
      </div>
    </div>
  )
}
