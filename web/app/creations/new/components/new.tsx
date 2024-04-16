'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormState } from 'react-hook-form'
import * as z from 'zod'
import { useEffect, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Layout from '@/components/layout'
import { useToast } from '@/components/ui/use-toast'
import type { Signatures } from '@/lib/api'
import SignaturesView from '@/app/components/signatures-view'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters long'
    })
    .max(100, {
      message: 'Name must be at most 100 characters long'
    }),
  lastName: z
    .string()
    .min(2, {
      message: 'Last name must be at least 2 characters long'
    })
    .max(100, {
      message: 'Last name must be at most 100 characters long'
    }),
  email: z
    .string()
    .email()
    .min(2, {
      message: 'Email must be at least 2 characters long'
    })
    .max(254, {
      message: 'Email must be at most 254 characters long'
    }),
  creationName: z
    .string()
    .max(100, {
      message: 'Creation name must be at most 100 characters long'
    })
    .optional()
    .transform((e) => (e === '' ? undefined : e)),
  public: z.boolean()
})

export default function Contact() {
  const [loading, setLoading] = useState(false)
  const [newCreation, setNewCreation] = useState({} as Signatures)
  const [creationQuery, setCreationQuery] = useState('')
  const [signaturesCount, setSignaturesCount] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [creationData, setCreationData] = useState({} as any)

  const { toast } = useToast()
  const router = useRouter()

  const supabase = createClient()

  useEffect(() => {
    const signatures: { image: string; seed: string }[] = []

    const count = localStorage.getItem('poc.new.creation.signatures.count')
    if (count) {
      setSignaturesCount(parseInt(count))
      for (let i = 0; i < parseInt(count); i++) {
        const signature = localStorage.getItem(`poc.new.creation.signatures.${i}`)
        if (signature) {
          signatures.push(JSON.parse(signature))
        }
      }
    } else {
      clearLocalStorage()
      router.push('/creations')
    }

    const creation = localStorage.getItem('poc.new.creation')
    if (creation) {
      setNewCreation({ ...JSON.parse(creation), signatures })
    } else {
      clearLocalStorage()
      router.push('/creations')
    }

    const query = localStorage.getItem('poc.create.query')
    if (query) {
      setCreationQuery(query)
    } else {
      clearLocalStorage()
      router.push('/creations')
    }

    const data = localStorage.getItem('poc.new.creation.data')
    if (data) {
      setCreationData(JSON.parse(data))
    } else {
      clearLocalStorage()
      router.push('/creations')
    }
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      creationName: '',
      public: true
    },
    shouldUnregister: false
  })

  const { isValid } = useFormState({ control: form.control })

  function clearLocalStorage() {
    for (let i = 0; i < signaturesCount; i++) {
      localStorage.removeItem(`poc.new.creation.signatures.${i}`)
    }
    ;[
      'poc.new.creation.signatures.count',
      'poc.new.creation',
      'poc.create.query',
      'poc.new.creation.data'
    ].forEach((key) => localStorage.removeItem(key))
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    try {
      const paths = await Promise.all(
        newCreation.signatures.map(async ({ seed, image }) => {
          const { data, error } = await supabase.storage
            .from('signatures')
            .upload(`${seed}.png`, Buffer.from(image, 'base64'), {
              contentType: 'image/png'
            })

          if (error) {
            console.error(error)

            toast({
              variant: 'destructive',
              className: 'rounded-none p-2',
              description: 'an error occurred!'
            })
          }

          return data?.path
        })
      )

      const bucketImages = paths.map((path) => {
        const { data } = supabase.storage.from('signatures').getPublicUrl(path!)

        return data.publicUrl
      })

      if (bucketImages) {
        const { public: isCreationPublic, email, firstName, lastName, creationName } = values
        const { combinedVelocity, layerDimensions, strategy } = newCreation

        const { data, error } = await supabase
          .from('signatures')
          .insert({
            creation_query: creationQuery,
            combined_velocity: combinedVelocity,
            strategy,
            layer_dimensions: layerDimensions,
            public: isCreationPublic,
            signatures: bucketImages,
            creator_first_name: firstName,
            creator_last_name: lastName,
            creator_email: email,
            creation_name: creationName,
            ...creationData
          })
          .select()

        if (error) {
          console.error(error)
          toast({
            variant: 'destructive',
            className: 'rounded-none p-2',
            description: 'an error occurred!'
          })
        } else {
          clearLocalStorage()

          const { id } = data[0]!

          router.push(`/creations/${id}`)
        }
      } else {
        console.error('error')
        toast({
          variant: 'destructive',
          className: 'rounded-none p-2',
          description: 'an error occurred!'
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        className: 'rounded-none p-2',
        description: 'an error occurred!'
      })
    }

    setLoading(false)
  }

  return (
    <Layout className="h-full w-full">
      <div className="flex min-h-[67vh] w-full items-start justify-center py-10">
        <main className="flex w-full flex-col items-center justify-center gap-x-32 gap-y-10 text-lg font-light px-6 tracking-tighter md:max-w-7xl">
          {newCreation.combinedVelocity ? (
            <article className="flex w-full flex-col items-center justify-center gap-y-4 pb-10 md:w-[40rem] lg:w-[50rem]">
              <div className="flex flex-col w-full gap-y-8 md:pl-24">
                <div className="flex flex-col w-full gap-y-2">
                  <h4 className="text-lg font-semibold tracking-tight sm:text-xl xl:text-2xl">
                    save your signatures to community creations
                  </h4>
                  <p className="text-sm text-muted-foreground tracking-tight">
                    fill in the form bellow to save your creations.
                  </p>
                </div>
                <div className="flex w-full items-start gap-y-4 justify-center flex-col">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex w-full min-w-64 flex-col max-w-[32rem] gap-y-4 gap-x-4"
                    >
                      <div className="flex flex-col justify-between gap-y-4 md:flex-row">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem className="md:max-w-60">
                              <FormLabel className="font-normal">first name</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  className="h-9 w-full md:w-60 rounded-none"
                                  placeholder="john"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="font-normal lowercase" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem className="md:max-w-60">
                              <FormLabel className="font-normal">last name</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  className="h-9 w-full md:w-60 rounded-none"
                                  placeholder="doe"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="font-normal lowercase" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-normal">email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                className="h-9 rounded-none"
                                placeholder="john@doe.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="font-normal lowercase text-muted-foreground leading-5">
                              will not be publicly displayed
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                      <div className="flex flex-col justify-between gap-y-4 md:flex-row">
                        <FormField
                          control={form.control}
                          name="creationName"
                          render={({ field }) => (
                            <FormItem className="md:max-w-60">
                              <FormLabel className="font-normal">creation name</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  className="h-9 w-full md:w-60 rounded-none"
                                  placeholder="the pion purge"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="font-normal lowercase text-muted-foreground">
                                optional
                              </FormMessage>
                            </FormItem>
                          )}
                        />
                        <div className="md:max-w-60 flex flex-col gap-y-3 md:pt-2">
                          <div className="flex flex-row gap-x-2">
                            <Checkbox
                              className="rounded-none"
                              checked={form.watch('public')}
                              onClick={() => form.setValue('public', !form.getValues().public)}
                            />
                            <Label
                              className="font-normal text-foreground cursor-pointer"
                              onClick={() => form.setValue('public', !form.getValues().public)}
                            >
                              public
                            </Label>
                          </div>
                          <p className="text-muted-foreground text-[12.8px] lowercase tracking-tighter font-normal leading-5">
                            whether your signatures will be public listed
                          </p>
                        </div>
                      </div>

                      <Button
                        disabled={!isValid || loading}
                        type="submit"
                        className="hover:bg-foreground mt-2 w-16 bg-foreground text-background rounded-none h-9 border"
                      >
                        {loading ? <LoaderCircle className="animate-spin" /> : 'save'}
                      </Button>
                    </form>
                  </Form>
                  <div className="w-full pt-4">
                    <SignaturesView
                      signatures={newCreation}
                      queryParams={creationQuery}
                      creationData={creationData}
                    />
                  </div>
                </div>
              </div>
            </article>
          ) : (
            <LoaderCircle className="text-muted-foreground text-4xl animate-spin" />
          )}
        </main>
      </div>
    </Layout>
  )
}
