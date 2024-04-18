/* eslint-disable @next/next/no-img-element */
'use client'

import type { ChangeEvent, FocusEvent } from 'react'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { LoaderCircle } from 'lucide-react'
import { BooleanParam, JsonParam, StringParam, useQueryParams, withDefault } from 'use-query-params'

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
import { type Signatures, createSignatures, getServiceType } from '@/lib/api'
import SignaturesView from '@/app/components/signatures-view'
import { createClient } from '@/utils/supabase/client'

export type ParticleData = {
  particle: string
  velocity: string
  priority: string
}

const PARTICLES = ['electron', 'proton', 'kaon', 'pion']
const ACTIVATION_FUNCTIONS = ['tanh', 'sigmoid', 'relu', 'softsign', 'sin', 'cos']

const DEFAULT_WIDTH_HEIGHT = 512

const PRODUCTION_MAX_WIDTH_HEIGHT = 768
const PRODUCTION_MIN_WIDTH_HEIGHT = 64
const PRODUCTION_MAX_IMAGES = 10

const NGROK_MAX_WIDTH_HEIGHT = 1280
const NGROK_MIN_WIDTH_HEIGHT = 64
const NGROK_MAX_IMAGES = 2

export default function Create() {
  const initialParticleData: ParticleData = {
    particle: '',
    velocity: '0',
    priority: PARTICLES.length.toString()
  }

  const [signatures, setSignatures] = useState({} as Signatures)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [creationData, setCreationData] = useState({} as any)
  const [maxWidthHeight, setMaxWidthHeight] = useState(PRODUCTION_MAX_WIDTH_HEIGHT)
  const [minWidthHeight, setMinWidthHeight] = useState(PRODUCTION_MIN_WIDTH_HEIGHT)
  const [maxImages, setMaxImages] = useState(PRODUCTION_MAX_IMAGES)

  const supabase = createClient()

  const [query, setQuery] = useQueryParams({
    width: withDefault(StringParam, DEFAULT_WIDTH_HEIGHT.toString()),
    height: withDefault(StringParam, DEFAULT_WIDTH_HEIGHT.toString()),
    images: withDefault(StringParam, '1'),
    alpha: withDefault(BooleanParam, false),
    symmetry: withDefault(BooleanParam, false),
    trig: withDefault(BooleanParam, false),
    noise: withDefault(BooleanParam, false),
    activation: withDefault(StringParam, 'tanh'),
    particleDataInputs: withDefault(JsonParam, [initialParticleData])
  })

  useEffect(() => {
    getServiceType()
      .then((type) => {
        if (type === 'ngrok') {
          setMaxWidthHeight(NGROK_MAX_WIDTH_HEIGHT)
          setMinWidthHeight(NGROK_MIN_WIDTH_HEIGHT)
          setMaxImages(NGROK_MAX_IMAGES)
        }
      })
      .catch()

    setQuery({
      ...query,
      particleDataInputs: query.particleDataInputs.map((data: ParticleData) => {
        let actualVelocity: string = data.velocity
        if (parseFloat(actualVelocity) < 1) {
          actualVelocity = Math.round(parseFloat(data.velocity) * 1e10).toString()
        }

        return {
          ...data,
          velocity: actualVelocity
        }
      })
    })
  }, [])

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

  function validateInputEvent(event: FocusEvent<HTMLInputElement, Element>) {
    // eslint-disable-next-line prefer-const
    let { name, value } = event.target

    validateValue(name, value)
  }

  function validateValue(name: string, value: string) {
    if (name === 'width' || name === 'height') {
      if (parseInt(value) > maxWidthHeight) {
        value = maxWidthHeight.toString()

        toast({
          className: 'rounded-none p-2',
          description: `maximum width and height is ${maxWidthHeight} px!`
        })
      } else if (parseInt(value) < minWidthHeight) {
        value = minWidthHeight.toString()

        toast({
          className: 'rounded-none p-2',
          description: `minimum width and height is ${minWidthHeight} px!`
        })
      } else if (!value) {
        value = DEFAULT_WIDTH_HEIGHT.toString()
      }
    } else if (name === 'images') {
      if (parseInt(value) > maxImages) {
        value = maxImages.toString()

        toast({
          className: 'rounded-none p-2',
          description: `maximum images is ${maxImages}!`
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setCreationLoading(true)

      getServiceType().then((type) => {
        if (type === 'ngrok') {
          setMaxWidthHeight(NGROK_MAX_WIDTH_HEIGHT)
          setMinWidthHeight(NGROK_MIN_WIDTH_HEIGHT)
          setMaxImages(NGROK_MAX_IMAGES)
        }

        validateValue('width', width)
        validateValue('height', height)
        validateValue('images', images)
      })

      localStorage.clear()
      localStorage.setItem('poc.create.query', location.search)

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
          velocity: parseFloat((parseInt(input.velocity) * 1e-10).toFixed(10)),
          priority: parseInt(input.priority)
        }))
      }

      setCreationData(body)

      setSignatures(await createSignatures(body))
    } catch {
      toast({
        variant: 'destructive',
        className: 'rounded-none p-2',
        description: 'an error occurred, please try again!'
      })
    } finally {
      setCreationLoading(false)

      const thirtyMinutesAgo = new Date(new Date().getTime() - 0.2 * 60 * 1000).toISOString()

      const { data, error } = await supabase
        .from('uploads')
        .select('*', { count: 'exact' })
        .eq('verified', false)
        .eq('deleted', false)
        .lte('created_at', thirtyMinutesAgo)

      if (!error) {
        const idsToDelete = data.map(({ id }) => id)
        const signaturesToDelete = data.map(({ name }) => name)

        await supabase.from('uploads').update({ deleted: true }).in('id', idsToDelete)
        await supabase.storage.from('signatures').remove(signaturesToDelete)
      }
    }
  }

  useEffect(() => {
    const isValidInput = particleDataInputs.every(
      (input: ParticleData) =>
        PARTICLES.includes(input.particle) &&
        input.velocity !== '' &&
        parseFloat(input.velocity) > 0
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
                  fill in the desired parameters below to create your very own signatures. note that
                  each particle has a precedence priority; the higher it is, the most influence it
                  will have on the final signatures. refer to the paper section{' '}
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
                        <p className="text-muted-foreground text-[12.8px] lowercase tracking-tighter font-normal leading-5">
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
                                  max={maxImages}
                                  value={images}
                                  onChange={handleConfigurationChange}
                                  onBlur={validateInputEvent}
                                />
                                <p className="text-muted-foreground text-[12.8px] lowercase tracking-tighter font-normal leading-5">
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
                                    width === DEFAULT_WIDTH_HEIGHT.toString() &&
                                      'text-muted-foreground'
                                  )}
                                  min={minWidthHeight}
                                  max={maxWidthHeight}
                                  value={width}
                                  onChange={handleConfigurationChange}
                                  onBlur={validateInputEvent}
                                />
                                <p className="text-muted-foreground text-[12.8px] lowercase tracking-tighter font-normal leading-5">
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
                                    height === DEFAULT_WIDTH_HEIGHT.toString() &&
                                      'text-muted-foreground'
                                  )}
                                  min={minWidthHeight}
                                  max={maxWidthHeight}
                                  value={height}
                                  onChange={handleConfigurationChange}
                                  onBlur={validateInputEvent}
                                />
                                <p className="text-muted-foreground text-[12.8px] lowercase tracking-tighter font-normal leading-5">
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
                                  <p className="text-muted-foreground text-[12.8px] lowercase tracking-tighter font-normal leading-5">
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
                                  <p className="text-muted-foreground text-[12.8px] lowercase tracking-tighter font-normal leading-5">
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
                                  <p className="text-muted-foreground text-[12.8px] lowercase tracking-tighter font-normal leading-5">
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
                                  <p className="text-muted-foreground text-[12.8px] lowercase tracking-tighter font-normal leading-5">
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
                                  <p className="text-muted-foreground text-[12.8px] lowercase tracking-tighter font-normal leading-5">
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
                        <p className="text-muted-foreground flex h-auto flex-col gap-y-0 text-[12.8px] leading-5 lowercase tracking-tighter font-normal">
                          please note that the model still outputs non-consistents results.
                          <br />
                          generation might take some time depending on the chosen parameters.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </form>
              {signatures.combinedVelocity && !creationLoading && (
                <SignaturesView
                  signatures={signatures}
                  queryParams={location.search}
                  creationData={creationData}
                />
              )}
            </div>
          </article>
        </main>
      </div>
    </Layout>
  )
}
