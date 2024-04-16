import type { ChangeEvent, FocusEvent } from 'react'

import Combobox from './combobox'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import type { ParticleData } from '../create'
import { toast } from '@/components/ui/use-toast'

type ParticleDataInputProps = {
  availableParticles: string[]
  particleData: ParticleData
  setParticleData: (index: number, field: string, value: string) => void
  index: number
}

const MIN_VELOCITY = 1
const MAX_VELOCITY = 299792458

export default function ParticleDataInput({
  availableParticles,
  particleData,
  setParticleData,
  index
}: ParticleDataInputProps) {
  function handleParticleChange(value: string) {
    setParticleData(index, 'particle', value)
  }

  function handleVelocityChange(event: ChangeEvent<HTMLInputElement>) {
    setParticleData(index, 'velocity', event.target.value)
  }

  function validateValue(event: FocusEvent<HTMLInputElement, HTMLElement>) {
    if (parseFloat(event.target.value) < MIN_VELOCITY) {
      setParticleData(index, 'velocity', MIN_VELOCITY.toString())

      toast({
        className: 'rounded-none p-2',
        description: `minimum velocity is ${MIN_VELOCITY}!`
      })
    } else if (parseFloat(event.target.value) > MAX_VELOCITY) {
      setParticleData(index, 'velocity', MAX_VELOCITY.toString())

      toast({
        className: 'rounded-none p-2',
        description: `maximum velocity is ${MAX_VELOCITY} m/s - the speed of light!`
      })
    } else if (!event.target.value) {
      setParticleData(index, 'velocity', MIN_VELOCITY.toString())
    } else if (event.target.value.length !== MIN_VELOCITY.toString().length) {
      setParticleData(
        index,
        'velocity',
        event.target.value.padEnd(MIN_VELOCITY.toString().length, '0')
      )
    }
  }

  return (
    <div className="flex w-full flex-col gap-y-6">
      <div className="flex w-full min-w-64 flex-row gap-x-4">
        <div className="flex flex-col justify-start items-start gap-x-4 gap-y-6 md:flex-row">
          <div>
            <div className="flex max-w-52 flex-col gap-y-3">
              <Label className="font-normal">particle</Label>
              <Combobox
                attributes={availableParticles}
                attributeName="particle"
                value={particleData.particle}
                onChange={handleParticleChange}
                className="rounded-none"
              />
              <p className="text-muted-foreground text-[12.8px] lowercase tracking-tighter font-normal leading-5">
                more types might be added in the future{' '}
              </p>
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-y-3 w-36">
              <Label className="font-normal">velocity (m/s)</Label>
              <Input
                type="number"
                className={cn(
                  'rounded-none shadow-none',
                  particleData.velocity === '0' && 'text-muted-foreground'
                )}
                min={MIN_VELOCITY}
                max={MAX_VELOCITY}
                value={particleData.velocity}
                onChange={handleVelocityChange}
                onBlur={validateValue}
              />
              <p className="text-muted-foreground text-[12.8px] lowercase tracking-tighter font-normal leading-5">
                {(parseInt(particleData.velocity) * 1e-10).toFixed(10)} cm/ps
              </p>
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-y-3">
              <Label className="font-normal text-muted-foreground">
                spatial distribution (coming soon)
              </Label>
              <Input type="file" disabled className="rounded-none shadow-none" />

              <p className="text-muted-foreground text-[12.8px] lowercase tracking-tighter font-normal leading-5">
                allowed file types: .csv, .npy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
