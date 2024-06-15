import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import { HardwareStatus, SystemStatus } from '@/lib/api'
import { getStatuses } from '@/lib/api'

export default function Status() {
  const [systemStatus, setSystemStatus] = useState(SystemStatus.Downtime)
  const [hardwareStatus, setHardwareStatus] = useState(HardwareStatus.None)

  useEffect(() => {
    getStatuses().then((statuses) => {
      const [system, hardware] = statuses!
      setSystemStatus(system as SystemStatus)
      setHardwareStatus(hardware as HardwareStatus)
    })
  }, [])

  const systemStatusStyle: { [key in SystemStatus]: string } = {
    [SystemStatus.Downtime]: 'bg-orange-500',
    [SystemStatus.Operational]: 'bg-green-500',
    [SystemStatus.Down]: 'bg-red-500'
  }

  const hardwareStatusStyle: { [key in HardwareStatus]: string } = {
    [HardwareStatus.Standard]: 'bg-muted-foreground',
    [HardwareStatus.Accelerated]: 'bg-blue-500',
    [HardwareStatus.None]: 'bg-red-500'
  }

  return (
    <div className="flex flex-col gap-y-3">
      <h4 className="text-sm font-medium h-4">status</h4>
      <div className="text-muted-foreground h-4 flex flex-row items-center justify-start gap-x-2">
        <div
          className={cn(
            "before:'' h-2 w-2 rounded-full mt-[2px] transition-colors duration-1000",
            systemStatusStyle[systemStatus]
          )}
        />
        <p className="h-4 flex items-center text-sm font-normal transition-colors duration-200">
          {systemStatus}
        </p>
      </div>
      <div className="text-muted-foreground h-4 flex flex-row items-center justify-start gap-x-2">
        <div
          className={cn(
            "before:'' h-2 w-2 rounded-full mt-[2px] transition-colors duration-1000",
            hardwareStatusStyle[hardwareStatus]
          )}
        />
        <p className="h-4 flex items-center text-sm font-normal transition-colors duration-200">
          {hardwareStatus}
        </p>
      </div>
    </div>
  )
}
