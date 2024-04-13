'use client'

import type { ChangeEvent } from 'react'
import React, { useState } from 'react'
import Link from 'next/link'

import Layout from '@/components/layout'
import { Button } from '@/components/ui/button'
import ParticleDataInput from './particle-data-input'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export type ParticleData = {
  particle: string
  velocity: string
  timestamp: number
}

const PARTICLES = ['electron', 'proton', 'kaon', 'pion']

export default function Create() {
  const initialParticleData: ParticleData = {
    particle: '',
    velocity: '0',
    timestamp: new Date().getTime()
  }

  const [particleDataInputs, setParticleDataInputs] = useState([initialParticleData])
  const [configuration, setConfiguration] = useState({
    width: '512',
    height: '512',
    images: '1',
    alphaChannel: false
  })

  function setParticleData(index: number, field: string, value: string) {
    const newData = [...particleDataInputs]
    newData[index] = { ...newData[index], [field]: value }
    setParticleDataInputs(newData)
  }

  function addParticleDataInput() {
    if (particleDataInputs.length < PARTICLES.length) {
      setParticleDataInputs([
        ...particleDataInputs,
        { particle: '', velocity: '1', timestamp: new Date().getTime() }
      ])
    }
  }

  function removeParticleDataInput(index: number) {
    const newData = [...particleDataInputs]
    newData.splice(index, 1)
    setParticleDataInputs(newData)
  }

  function getAvailableParticles() {
    return PARTICLES.filter(
      (particle) => !particleDataInputs.some((data) => data.particle === particle)
    )
  }

  function handleConfigurationChange(event: ChangeEvent<HTMLInputElement>) {
    // eslint-disable-next-line prefer-const
    let { name, value } = event.target

    if (name === 'width' || name === 'height') {
      if (parseInt(value) > 2048) {
        value = '2048'
      } else if (parseInt(value) < 64) {
        value = '64'
      }
    } else if (name === 'images') {
      if (parseInt(value) > 10) {
        value = '10'
      } else if (parseInt(value) < 1) {
        value = '1'
      }
    }

    setConfiguration({ ...configuration, [name]: value })
  }

  return (
    <Layout className="h-full w-full">
      <div className="flex min-h-[68vh] w-full items-start justify-center py-10">
        <main className="flex w-full flex-col items-center justify-center gap-x-32 gap-y-10 text-lg font-light px-6 tracking-tighter md:max-w-7xl">
          <article className="flex w-full flex-col items-center justify-center gap-y-4 pb-10 md:w-[40rem] lg:w-[50rem]">
            <div className="flex flex-col w-full gap-y-8 md:pl-24">
              <div className="flex flex-col w-full gap-y-2">
                <h4 className="text-lg font-semibold tracking-tight sm:text-xl xl:text-2xl">
                  create your own experiment signature
                </h4>
                <p className="text-sm text-muted-foreground tracking-tight">
                  refer to the paper section{' '}
                  <Link
                    href={'/paper#data-driven-art-creation'}
                    className="text-[#085fce]/75 hover:text-[#085fce] dark:text-[#04dcd4]/75 hover:dark:text-[#04dcd4] transition-colors duration-100 underline underline-offset-4"
                  >
                    data-driven art creation
                  </Link>{' '}
                  to better understand how the data is used to create an experiment signature.
                </p>
              </div>
              <div className="flex w-full items-start gap-y-4 justify-center flex-col">
                <div className="space-y-8 w-full">
                  {particleDataInputs.map((data, i) => (
                    <div key={`particle-input-${i}`} className="space-y-8">
                      <div className="space-y-2 flex flex-col items-end">
                        <ParticleDataInput
                          index={i}
                          availableParticles={getAvailableParticles()}
                          particleData={data}
                          setParticleData={setParticleData}
                        />
                        {i !== 0 && (
                          <Button
                            onClick={() => removeParticleDataInput(i)}
                            variant={'secondary'}
                            type={'button'}
                            className="shadow-none border hover:bg-background bg-background rounded-none disabled:cursor-not-allowed"
                          >
                            remove
                          </Button>
                        )}
                      </div>
                      {particleDataInputs.length > 1 && i !== particleDataInputs.length - 1 && (
                        <hr />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex w-full items-start flex-col gap-y-8 gap-x-6">
                  <Button
                    onClick={addParticleDataInput}
                    variant={'secondary'}
                    type={'button'}
                    disabled={particleDataInputs.length >= PARTICLES.length}
                    className="shadow-none border hover:bg-background bg-background rounded-none disabled:cursor-not-allowed"
                  >
                    add particle data input
                  </Button>
                  <hr className="w-full" />
                  <div className="w-full flex flex-col items-start gap-y-6">
                    <div className="flex w-full flex-col gap-y-6">
                      <div className="flex w-full min-w-64 flex-row gap-x-4">
                        <div className="flex w-full flex-col justify-start items-start gap-x-4 gap-y-6 md:flex-row">
                          <div className="w-full md:max-w-[200px]">
                            <div className="flex flex-col w-full gap-y-3 items-start justify-center">
                              <Label className="font-normal">images</Label>
                              <div className="flex flex-row w-auto gap-y-3 md:flex-col md:items-start items-center gap-x-4">
                                <Input
                                  name="images"
                                  type="number"
                                  className={cn(
                                    'rounded-none shadow-none w-20',
                                    configuration.images === '1' && 'text-muted-foreground'
                                  )}
                                  min={1}
                                  max={10}
                                  value={configuration.images}
                                  onChange={handleConfigurationChange}
                                />
                                <p className="text-muted-foreground text-[12.8px] lowercase tracking-tighter font-normal">
                                  how many images will be created
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="w-full md:max-w-[200px]">
                            <div className="flex flex-col w-full gap-y-3 items-start justify-center">
                              <Label className="font-normal">width</Label>
                              <div className="flex flex-row w-auto gap-y-3 md:flex-col md:items-start items-center gap-x-4">
                                <Input
                                  name="width"
                                  type="number"
                                  className={cn(
                                    'rounded-none shadow-none w-20',
                                    configuration.width === '512' && 'text-muted-foreground'
                                  )}
                                  min={64}
                                  max={2048}
                                  value={configuration.width}
                                  onChange={handleConfigurationChange}
                                />
                                <p className="text-muted-foreground text-[12.8px] lowercase tracking-tighter font-normal">
                                  final image width (px)
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="w-full md:max-w-[200px]">
                            <div className="flex flex-col w-full gap-y-3 items-start justify-center">
                              <Label className="font-normal">height</Label>
                              <div className="flex flex-row w-full gap-y-3 md:flex-col md:items-start items-center gap-x-4">
                                <Input
                                  name="height"
                                  type="number"
                                  className={cn(
                                    'rounded-none shadow-none w-20',
                                    configuration.height === '512' && 'text-muted-foreground'
                                  )}
                                  min={64}
                                  max={2048}
                                  value={configuration.height}
                                  onChange={handleConfigurationChange}
                                />
                                <p className="text-muted-foreground text-[12.8px] lowercase tracking-tighter font-normal">
                                  final image height (px)
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      type={'submit'}
                      disabled
                      className="rounded-none shadow-none cursor-progress hover:bg-foreground"
                    >
                      create (coming soon)
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </main>
      </div>
    </Layout>
  )
}
