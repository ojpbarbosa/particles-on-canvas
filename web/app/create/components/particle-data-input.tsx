'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import Combobox from './combobox'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const particles = [
  {
    value: 'electron',
    label: 'electron'
  },
  {
    value: 'proton',
    label: 'proton'
  },
  {
    value: 'kaon',
    label: 'kaon'
  },
  {
    value: 'pion',
    label: 'pion'
  }
]

const formSchema = z.object({
  particle: z.string().min(1),
  velocity: z.string().min(1),
  spatialDistribution: z.string().min(1)
})

export default function ParticleDataInput() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    defaultValues: {
      particle: '',
      velocity: '0'
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {}

  return (
    <div className="flex w-full flex-col gap-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full min-w-64 flex-row gap-x-4"
        >
          <div className="flex flex-col justify-start items-start gap-x-4 gap-y-6 md:flex-row">
            <FormField
              control={form.control}
              name="particle"
              render={({ field }) => (
                <FormItem className="flex max-w-52 flex-col gap-y-1">
                  <FormLabel className="font-normal">particle</FormLabel>
                  <FormControl>
                    <Combobox
                      attributes={particles}
                      attributeName="particle"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      className="rounded-none"
                    />
                  </FormControl>
                  <FormMessage className="text-muted-foreground lowercase tracking-tighter font-normal">
                    more types might be added in the future{' '}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="velocity"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-y-1 w-20">
                  <FormLabel className="font-normal">velocity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className={cn('rounded-none', field.value === '0' && 'text-muted-foreground')}
                      min={0}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-muted-foreground lowercase tracking-tighter font-normal">
                    cm per ps
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="spatialDistribution"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-y-1">
                  <FormLabel className="font-normal">spatial distribution</FormLabel>
                  <FormControl>
                    <Input type="file" disabled className="rounded-none" {...field} />
                  </FormControl>
                  <FormMessage className="text-muted-foreground lowercase tracking-tighter font-normal">
                    allowed file types: .csv, .npy
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  )
}
