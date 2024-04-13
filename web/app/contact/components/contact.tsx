'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormState } from 'react-hook-form'
import * as z from 'zod'
import { useState } from 'react'
import { LoaderCircle } from 'lucide-react'

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
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

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
  message: z
    .string()
    .min(10, {
      message: 'Message must be at least 10 characters long'
    })
    .max(1000, {
      message: 'Message must be at most 1000 characters long'
    })
})

export default function Contact() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      message: ''
    },
    shouldUnregister: false
  })

  const { isValid } = useFormState({ control: form.control })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    await fetch('/api/send-email', {
      method: 'POST',
      body: JSON.stringify(values)
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false)
        if (data.emails && data.emails.length > 0) {
          form.reset()
          toast({
            variant: 'default',
            className: 'rounded-none p-2',
            description: 'your message has been sent, thanks for the contact!'
          })
        } else {
          toast({
            variant: 'destructive',
            className: 'rounded-none p-2',
            description: 'an error occurred, please try again!'
          })
        }
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          className: 'rounded-none p-2',
          description: 'an error occurred, please try again!'
        })
        setLoading(false)
      })
  }

  return (
    <Layout className="h-full w-full">
      <div className="flex min-h-[75vh] w-full items-start justify-center py-10">
        <main className="flex w-full flex-col items-center justify-center gap-x-32 gap-y-10 text-lg font-light px-6 tracking-tighter md:max-w-7xl">
          <article className="flex w-full flex-col items-center justify-center gap-y-4 pb-10 md:w-[40rem] lg:w-[50rem]">
            <div className="flex flex-col w-full gap-y-8 md:pl-24">
              <div className="flex flex-col w-full gap-y-2">
                <h4 className="text-lg font-semibold tracking-tight sm:text-xl xl:text-2xl">
                  contact us
                </h4>
                <p className="text-sm text-muted-foreground tracking-tight">
                  fill in the form below and we{"'"}ll get back to you as soon as possible.
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
                          <FormMessage className="font-normal lowercase" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-normal">message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="hi! I'd like to know more about the..."
                              className="rounded-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="font-normal lowercase" />
                        </FormItem>
                      )}
                    />

                    <Button
                      disabled={!isValid || loading}
                      type="submit"
                      className="hover:bg-foreground mt-2 w-32 bg-foreground text-background rounded-none h-9 border"
                    >
                      {loading ? <LoaderCircle className="animate-spin" /> : 'send message'}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </article>
        </main>
      </div>
    </Layout>
  )
}
