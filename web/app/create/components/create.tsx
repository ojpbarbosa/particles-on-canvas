/* eslint-disable @next/next/no-img-element */
'use client'

import type { ChangeEvent, FocusEvent } from 'react'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, LoaderCircle } from 'lucide-react'
import { BooleanParam, JsonParam, StringParam, useQueryParams, withDefault } from 'use-query-params'
import copy from 'clipboard-copy'
import { usePathname, useSearchParams } from 'next/navigation'

import Layout from '@/components/layout'
import { Button } from '@/components/ui/button'
import ParticleDataInput from './particle-data-input'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import Combobox from './particle-data-input/combobox'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/components/ui/use-toast'
import { type Signatures, createSignatures } from '@/lib/api'

export type ParticleData = {
  particle: string
  velocity: string
  priority: string
}

const PARTICLES = ['electron', 'proton', 'kaon', 'pion']
const ACTIVATION_FUNCTIONS = ['tanh', 'sigmoid', 'relu', 'softsign', 'sin', 'cos']

export default function Create() {
  const initialParticleData: ParticleData = {
    particle: '',
    velocity: '1',
    priority: PARTICLES.length.toString()
  }

  const [signatures, setSignatures] = useState({} as Signatures)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [query, setQuery] = useQueryParams({
    width: withDefault(StringParam, '256'),
    height: withDefault(StringParam, '256'),
    images: withDefault(StringParam, '1'),
    alpha: withDefault(BooleanParam, false),
    symmetry: withDefault(BooleanParam, false),
    trig: withDefault(BooleanParam, false),
    noise: withDefault(BooleanParam, false),
    activation: withDefault(StringParam, 'tanh'),
    particleDataInputs: withDefault(JsonParam, [initialParticleData])
  })

  const { width, height, images, alpha, symmetry, trig, noise, activation, particleDataInputs } =
    query

  const [unableToCreate, setUnableToCreate] = useState(false)
  const [creationLoading, setCreationLoading] = useState(false)

  function setParticleData(index: number, field: string, value: string) {
    const newData = [...particleDataInputs]
    newData[index] = { ...newData[index], [field]: value }
    setQuery({ ...query, particleDataInputs: newData })
  }

  function addParticleDataInput() {
    if (particleDataInputs.length < PARTICLES.length) {
      const newData = [
        ...particleDataInputs,
        { ...initialParticleData, priority: PARTICLES.length - particleDataInputs.length }
      ]

      setQuery({ ...query, particleDataInputs: newData })
    }
  }

  function removeParticleDataInput(index: number) {
    const newData = [...particleDataInputs]
    newData.splice(index, 1)
    setQuery({ ...query, particleDataInputs: newData })
  }

  function getAvailableParticles() {
    return PARTICLES.filter(
      (particle) => !particleDataInputs.some((data: ParticleData) => data.particle === particle)
    )
  }

  function handleConfigurationChange(event: ChangeEvent<HTMLInputElement>) {
    // eslint-disable-next-line prefer-const
    let { name, value } = event.target

    setQuery({ ...query, [name]: value })
  }

  function validateValue(event: FocusEvent<HTMLInputElement, Element>) {
    // eslint-disable-next-line prefer-const
    let { name, value } = event.target

    if (name === 'width' || name === 'height') {
      if (parseInt(value) > 2048) {
        value = '2048'

        toast({
          className: 'rounded-none p-2',
          description: 'maximum width and height is 2048!'
        })
      } else if (parseInt(value) < 64) {
        value = '256'

        toast({
          className: 'rounded-none p-2',
          description: 'minimum width and height is 64!'
        })
      } else if (!value) {
        value = '256'
      }
    } else if (name === 'images') {
      if (parseInt(value) > 10) {
        value = '10'

        toast({
          className: 'rounded-none p-2',
          description: 'maximum images is 10!'
        })
      } else if (parseInt(value) < 1) {
        value = '1'

        toast({
          className: 'rounded-none p-2',
          description: 'minimum images is 1!'
        })
      } else if (!value) {
        value = '1'
      }
    }

    setQuery({ ...query, [name]: value })
  }

  const strategyToColor: { [key: string]: string } = {
    bw: 'Black and White',
    rgb: 'Red, Green, Blue',
    cmyk: 'Cyan, Magenta, Yellow, Black',
    hsv: 'Hue, Saturation, Value',
    hsl: 'Hue, Saturation, Lightness'
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setCreationLoading(true)
      const body = {
        width: parseInt(width),
        height: parseInt(height),
        images: parseInt(images),
        alpha,
        symmetry,
        trig,
        noise,
        activation,
        particles: particleDataInputs.map((input: ParticleData) => ({
          particle: input.particle,
          velocity: parseInt(input.velocity)
        }))
      }

      setSignatures(await createSignatures(body))

      setCreationLoading(false)
    } catch {
      setCreationLoading(false)
      toast({
        variant: 'destructive',
        className: 'rounded-none p-2',
        description: 'an error occurred, please try again!'
      })
    }
  }

  async function shareCurrentConfiguration() {
    try {
      await copy(`https://particles-on-canvas.vercel.app${pathname}?${searchParams.toString()}`)

      toast({
        className: 'rounded-none p-2',
        description: 'link copied to clipboard!'
      })
    } catch {
      toast({
        variant: 'destructive',
        className: 'rounded-none p-2',
        description: 'an error occurred, please try again!'
      })
    }
  }

  useEffect(() => {
    const isValidInput = particleDataInputs.every(
      (input: ParticleData) => PARTICLES.includes(input.particle) && input.velocity !== ''
    )
    setUnableToCreate(isValidInput)
  }, [particleDataInputs])

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
                  fill in the desired parameters bellow to create your very own signatures. note
                  that each particle has a precedence priority; the higher it is, the most influence
                  it will have on the final signatures. refer to the paper section{' '}
                  <Link
                    href={'/paper#data-driven-art-creation'}
                    className="text-[#085fce]/75 hover:text-[#085fce] dark:text-[#04dcd4]/75 hover:dark:text-[#04dcd4] transition-colors duration-100 underline underline-offset-4"
                  >
                    data-driven art creation
                  </Link>{' '}
                  to better understand how the data is used to create an experiment signature.
                </p>
              </div>
              <form
                onSubmit={handleSubmit}
                className="flex w-full items-start gap-y-4 justify-center flex-col"
              >
                <div className="space-y-8 w-full">
                  {particleDataInputs.map((data: ParticleData, i: number) => (
                    <div key={`particle-input-${i}`} className="space-y-8">
                      <div className="space-y-2 flex flex-col items-end">
                        <ParticleDataInput
                          index={i}
                          availableParticles={getAvailableParticles()}
                          particleData={data}
                          setParticleData={setParticleData}
                        />
                        <p className="text-muted-foreground text-[12.8px] lowercase tracking-tighter font-normal">
                          priority #{data.priority}
                        </p>
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
                      <div className="flex w-full min-w-64 flex-col gap-y-4">
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
                                    images === '1' && 'text-muted-foreground'
                                  )}
                                  min={1}
                                  max={10}
                                  value={images}
                                  onChange={handleConfigurationChange}
                                  onBlur={validateValue}
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
                                    width === '256' && 'text-muted-foreground'
                                  )}
                                  min={64}
                                  max={2048}
                                  value={width}
                                  onChange={handleConfigurationChange}
                                  onBlur={validateValue}
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
                                    height === '256' && 'text-muted-foreground'
                                  )}
                                  min={64}
                                  max={2048}
                                  value={height}
                                  onChange={handleConfigurationChange}
                                  onBlur={validateValue}
                                />
                                <p className="text-muted-foreground text-[12.8px] lowercase tracking-tighter font-normal">
                                  final image height (px)
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="accordion-nerd-options">
                            <AccordionTrigger className="underline-offset-4">
                              nerd options
                            </AccordionTrigger>
                            <AccordionContent className="flex flex-col md:gap-y-6">
                              <div className="flex md:flex-row pt-2 flex-col gap-y-6 gap-x-4">
                                <div className="flex max-w-52 flex-col gap-y-3">
                                  <div className="flex flex-row gap-x-2">
                                    <Checkbox
                                      className="rounded-none"
                                      name="symmetry"
                                      checked={symmetry}
                                      onClick={() =>
                                        setQuery({
                                          ...query,
                                          symmetry: !symmetry
                                        })
                                      }
                                    />
                                    <Label
                                      className="font-normal cursor-pointer"
                                      onClick={() =>
                                        setQuery({
                                          ...query,
                                          symmetry: !symmetry
                                        })
                                      }
                                    >
                                      symmetry
                                    </Label>
                                  </div>
                                  <p className="text-muted-foreground text-[12.8px] lowercase tracking-tighter font-normal">
                                    whether the generated images should be symmetrical
                                  </p>
                                </div>
                                <div className="flex max-w-52 flex-col gap-y-3">
                                  <div className="flex flex-row gap-x-2">
                                    <Checkbox
                                      className="rounded-none"
                                      name="alpha"
                                      checked={alpha}
                                      onClick={() =>
                                        setQuery({
                                          ...query,
                                          alpha: !alpha
                                        })
                                      }
                                    />
                                    <Label
                                      className="font-normal cursor-pointer"
                                      onClick={() =>
                                        setQuery({
                                          ...query,
                                          alpha: !alpha
                                        })
                                      }
                                    >
                                      alpha
                                    </Label>
                                  </div>
                                  <p className="text-muted-foreground text-[12.8px] lowercase tracking-tighter font-normal">
                                    whether the generated images should have an alpha channel
                                  </p>
                                </div>
                                <div className="flex max-w-52 flex-col gap-y-3">
                                  <div className="flex flex-row gap-x-2">
                                    <Checkbox
                                      className="rounded-none"
                                      name="trig"
                                      checked={trig}
                                      onClick={() =>
                                        setQuery({
                                          ...query,
                                          trig: !trig
                                        })
                                      }
                                    />
                                    <Label
                                      className="font-normal cursor-pointer"
                                      onClick={() =>
                                        setQuery({
                                          ...query,
                                          trig: !trig
                                        })
                                      }
                                    >
                                      trig
                                    </Label>
                                  </div>
                                  <p className="text-muted-foreground text-[12.8px] lowercase tracking-tighter font-normal">
                                    whether the neural network should use trigonometric
                                    transformations
                                  </p>
                                </div>
                              </div>
                              <div className="flex md:flex-row flex-col pt-6 md:pt-0 gap-y-6 gap-x-4">
                                <div className="flex max-w-52 flex-col gap-y-3">
                                  <div className="flex flex-row gap-x-2">
                                    <Checkbox
                                      className="rounded-none"
                                      name="noise"
                                      checked={noise}
                                      onClick={() =>
                                        setQuery({
                                          ...query,
                                          noise: !noise
                                        })
                                      }
                                    />
                                    <Label
                                      className="font-normal cursor-pointer"
                                      onClick={() =>
                                        setQuery({
                                          ...query,
                                          noise: !noise
                                        })
                                      }
                                    >
                                      noise
                                    </Label>
                                  </div>
                                  <p className="text-muted-foreground text-[12.8px] lowercase tracking-tighter font-normal">
                                    whether to apply gaussian noise to the neural network input
                                  </p>
                                </div>
                                <div className="flex max-w-52 flex-col gap-y-3">
                                  <Label className="font-normal">activation function</Label>
                                  <Combobox
                                    attributes={ACTIVATION_FUNCTIONS}
                                    attributeName="activation"
                                    value={activation}
                                    onChange={(value) => setQuery({ ...query, activation: value })}
                                    className="rounded-none w-[140px]"
                                  />
                                  <p className="text-muted-foreground text-[12.8px] lowercase tracking-tighter font-normal">
                                    which activation function the neural network should use to
                                    generate the images
                                  </p>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-3">
                      <div className="flex md:flex-row flex-col gap-y-3 gap-x-3 md:items-center">
                        <Button
                          type={'submit'}
                          disabled={!unableToCreate || creationLoading}
                          className="rounded-none shadow-none hover:bg-foreground w-20"
                        >
                          {creationLoading ? <LoaderCircle className="animate-spin" /> : 'create'}
                        </Button>
                        {!unableToCreate && (
                          <p className="text-muted-foreground flex h-auto flex-col gap-y-0 text-[12.8px] lowercase tracking-tighter font-normal">
                            please fill in all the particle data.
                          </p>
                        )}
                      </div>

                      {(creationLoading || signatures.combinedVelocity) && (
                        <p className="text-muted-foreground flex h-auto flex-col gap-y-0 text-[12.8px] lowercase tracking-tighter font-normal">
                          please note that the model still outputs non-consistents results.
                          <br />
                          generation might take some time depending on the chosen parameters.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </form>
              {signatures.combinedVelocity && (
                <div className="flex flex-col gap-y-6">
                  <div className="flex flex-col md:flex-row gap-x-8 gap-y-4 md:max-w-52 max-w-full">
                    <div className="space-y-1 min-w-32">
                      <p className="text-sm text-muted-foreground">strategy</p>
                      <p className="text-sm font-semibold tracking-tight lowercase">
                        {strategyToColor[signatures.strategy]}
                      </p>
                    </div>
                    <div className="space-y-1 min-w-32">
                      <p className="text-sm text-muted-foreground">combined velocity</p>
                      <p className="text-sm font-semibold tracking-tight">
                        {signatures.combinedVelocity}
                      </p>
                    </div>
                    <div className="space-y-1 min-w-52">
                      <p className="text-sm text-muted-foreground">layer dimensions</p>
                      <p className="text-sm font-semibold tracking-tight">
                        <span className="text-muted-foreground">[</span>
                        {signatures.layerDimensions.join(', ')}
                        <span className="text-muted-foreground">]</span>
                      </p>
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-y-4">
                    <p className="text-sm text-muted-foreground">signatures</p>
                    <div className="flex flex-col gap-y-6">
                      {signatures.signatures.map(({ image, seed }, i) => (
                        <div key={seed} className="flex flex-col gap-y-8">
                          <div className="flex items-start flex-col gap-y-4">
                            <img
                              className="max-w-full max-h-full"
                              src={`data:image/png;base64,${image}`}
                            />
                            <div className="w-full flex flex-col gap-y-3">
                              <Link
                                target="_blank"
                                referrerPolicy="no-referrer"
                                href={`data:image/png;base64,${image}`}
                                className="w-40"
                              >
                                <Button
                                  className="dark:border-muted px-4 shadow-none bg-background hover:bg-background flex h-9 items-center justify-start gap-x-2 rounded-none border border-neutral-200"
                                  variant={'secondary'}
                                >
                                  view raw image
                                  <ExternalLink height={16} width={16} />
                                </Button>
                              </Link>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">seed</p>
                                <p className="text-sm text-muted-foreground tracking-tight break-words">
                                  {seed}
                                </p>
                              </div>
                            </div>
                          </div>
                          {i !== signatures.signatures.length - 1 && <hr />}
                        </div>
                      ))}
                      <Button
                        onClick={shareCurrentConfiguration}
                        variant={'secondary'}
                        type={'button'}
                        className="shadow-none border w-60 hover:bg-background bg-background rounded-none disabled:cursor-not-allowed"
                      >
                        share current configuration
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </article>
        </main>
      </div>
    </Layout>
  )
}
