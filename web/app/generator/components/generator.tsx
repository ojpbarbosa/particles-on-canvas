'use client'

import React, { useState } from 'react'
import Link from 'next/link'

import Layout from '@/components/layout'
import { Button } from '@/components/ui/button'
import ParticleDataInput from './particle-data-input'

const PARTICLE_DATA_INPUT_COUNT = 4

export default function Generator() {
  const [particleDataInputs, setParticleDataInputs] = useState([{ data: {}, date: new Date() }])

  function addParticleDataInput() {
    if (particleDataInputs.length < PARTICLE_DATA_INPUT_COUNT) {
      setParticleDataInputs([...particleDataInputs, { data: {}, date: new Date() }])
    }
  }

  return (
    <Layout className="h-full w-full">
      <div className="flex min-h-[75vh] w-full items-start justify-center py-10">
        <main className="flex w-full flex-col items-center justify-center gap-x-32 gap-y-10 text-lg font-light px-6 tracking-tighter md:max-w-7xl">
          <article className="flex w-full flex-col items-center justify-center gap-y-4 pb-10 md:w-[40rem] lg:w-[50rem]">
            <div className="flex flex-col w-full gap-y-8 md:pl-24">
              <div className="flex flex-col w-full gap-y-2">
                <h4 className="text-lg font-semibold tracking-tight sm:text-xl xl:text-2xl">
                  generate your own experiment signature
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
                <div className="space-y-8">
                  {particleDataInputs.map((input, i) => (
                    <>
                      <ParticleDataInput key={`particle-input-${i}`} />
                      {particleDataInputs.length > 1 && i !== particleDataInputs.length - 1 && (
                        <hr />
                      )}
                    </>
                  ))}
                </div>

                <div className="flex sm:flex-row flex-col gap-y-4 gap-x-6">
                  <Button
                    onClick={addParticleDataInput}
                    variant={'secondary'}
                    type={'button'}
                    disabled={particleDataInputs.length >= PARTICLE_DATA_INPUT_COUNT}
                    className="shadow-none border hover:bg-background bg-background rounded-none disabled:cursor-not-allowed"
                  >
                    add particle data input
                  </Button>
                  <Button
                    type={'submit'}
                    disabled
                    className="rounded-none shadow-none cursor-progress hover:bg-foreground"
                  >
                    generate (coming soon)
                  </Button>
                </div>
              </div>
            </div>
          </article>
        </main>
      </div>
    </Layout>
  )
}
