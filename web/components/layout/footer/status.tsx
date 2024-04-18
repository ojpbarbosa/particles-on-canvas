import { heartbeat } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Zap, ZapOff } from 'lucide-react'
import { useEffect, useState } from 'react'

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

  return (
    <div className="flex flex-col gap-y-3">
      <h4 className="text-sm font-medium h-4">status</h4>
      <div className="text-muted-foreground h-4 flex flex-row items-center justify-start gap-x-2">
        <div
          className={cn(
            "before:'' h-2 w-2 rounded-full mt-[1px] transition-colors duration-1000",
            statusStyle[status]
          )}
        />
        <p className="h-4 flex items-center text-sm font-normal transition-colors duration-200">
          {status}
        </p>
      </div>

      <p className="text-muted-foreground h-4 flex items-start md:items-center text-sm font-normal transition-colors duration-200">
        {accelerated ? (
          <>
            <Zap className="md:-ml-2 -ml-1 mr-1 mt-0.5 md:mt-0 md:mr-0" height={17} /> create is
            currently using hardware acceleration
          </>
        ) : (
          <>
            <ZapOff className="md:-ml-2 -ml-1 mr-1 mt-0.5 md:mt-0 md:mr-0" height={17} /> create is
            currently using slow hardware
          </>
        )}
      </p>
    </div>
  )
}
