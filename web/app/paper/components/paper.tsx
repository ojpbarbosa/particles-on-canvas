import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

import Layout from '@/components/layout'
import MarkdownContent from '@/components/markdown-content'
import { Button } from '@/components/ui/button'
import { getContent } from '@/lib/content'

export const dynamic = 'force-static'

const file = '/paper.pdf'

export default async function Paper() {
  const paper = await getContent('paper')

  return (
    <Layout className="h-full w-full justify-start">
      <div className="flex min-h-[80vh] w-full items-start justify-center py-10">
        <main className="flex w-full xl:flex-row flex-col items-start justify-center gap-x-32 gap-y-10 text-lg font-light px-10 sm:px-6 tracking-tighter md:max-w-7xl md:justify-start">
          <Link href={file} className="">
            <Button
              className="dark:border-muted px-4 shadow-none bg-background hover:bg-background flex h-9 items-center justify-start gap-x-2 rounded-none border border-neutral-200"
              variant={'secondary'}
            >
              view in pdf
              <ExternalLink height={16} width={16} />
            </Button>
          </Link>
          <article className="flex w-full flex-col items-center gap-y-4 pb-10 md:w-[40rem] lg:w-[50rem]">
            <div className="flex flex-col gap-y-2">
              <h2 className="text-2xl font-semibold tracking-tighter sm:text-3xl xl:text-4xl/none">
                Particle on Canvas: Creating Digital Art to Further Scientific Divulgation
              </h2>
              <p className="text-muted-foreground text-sm tracking-tight md:text-base">
                A project by Beatriz Juliato Coutinho, Éric Carvalho Figueira, Gabriel Willian
                Bartmanovicz, Hugo Gomes Soares, João Pedro Ferreira Barbosa, Julia Enriquetto de
                Brito, Marcos Godinho Filho, and Nicolas Militão Livotto, students of the Technical
                High School of Campinas, São Paulo, Brazil.
              </p>
            </div>
            {paper && <MarkdownContent>{paper?.body}</MarkdownContent>}
          </article>
        </main>
      </div>
    </Layout>
  )
}
