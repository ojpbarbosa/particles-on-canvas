import Link from 'next/link'

import Layout from '@/components/layout'
import MarkdownContent from '@/components/markdown-content'
import { getAbout } from '@/lib/content'

export default async function About() {
  const about = await getAbout()

  return (
    <Layout className="h-full w-full justify-start">
      <div className="flex min-h-[75vh] w-full items-start justify-center py-10">
        <main className="flex w-full xl:flex-row flex-col items-center justify-center gap-x-44 gap-y-10 text-lg font-light px-6 tracking-tighter md:max-w-7xl md:justify-end md:pr-36">
          <article className="flex w-full flex-col items-center gap-y-4 pb-10 md:w-[40rem] lg:w-[50rem]">
            <div className="flex flex-col gap-y-2">
              <h4 className="text-lg font-semibold tracking-tight sm:text-xl xl:text-2xl">about</h4>
              <p className="text-muted-foreground text-sm tracking-tight">
                refer to the paper sections{' '}
                <Link
                  href={'/paper#our-motivation'}
                  className="text-[#085fce]/75 hover:text-[#085fce] dark:text-[#04dcd4]/75 hover:dark:text-[#04dcd4] transition-colors duration-100 underline underline-offset-4"
                >
                  our motivation
                </Link>{' '}
                and{' '}
                <Link
                  href={'/paper#what-we-hope-to-take-from-this-experience'}
                  className="text-[#085fce]/75 hover:text-[#085fce] dark:text-[#04dcd4]/75 hover:dark:text-[#04dcd4] transition-colors duration-100 underline underline-offset-4"
                >
                  what we hope to take from this experience
                </Link>{' '}
                to better understand the roots & values of this project.
              </p>
            </div>
            {about && <MarkdownContent>{about?.body}</MarkdownContent>}
          </article>
        </main>
      </div>
    </Layout>
  )
}
