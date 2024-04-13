import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import type { JSX, ClassAttributes, AnchorHTMLAttributes } from 'react'
import React from 'react'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import remarkToc from 'remark-toc'

function CustomLink(
  props: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLAnchorElement> &
    AnchorHTMLAttributes<HTMLAnchorElement>
) {
  const href = props.href!

  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return <a {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

const components = {
  a: CustomLink
}

export default function MarkdownContent({ children }: { children: string }) {
  return (
    <div className="prose prose-img:bg-white prose-headings:text-foreground prose-p:text-balance prose-strong:text-primary prose-headings:font-semibold prose-a:underline prose-a:transition-colors prose-a:duration-200 prose-a:text-[#085fce]/75 hover:prose-a:text-[#085fce] prose-a:dark:text-[#04dcd4]/75 hover:prose-a:dark:text-[#04dcd4] text-foreground prose-headings:tracking-tighter prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-h5:text-base prose-h6:text-sm prose-h1:font-semibold prose-blockquote:border-background-muted prose-blockquote:font-normal prose-li:pl-0 marker:prose-li:text-pandemica-yellow prose-code:p-1 prose-thead:border-background-muted prose-th:border-background-muted prose-tr:border-background-muted prose-blockquote:text-foreground-muted prose-code:text-foreground-muted prose-strong:text-foreground-muted text-foreground-muted prose-hr:border-background-muted prose-em:italic prose-strong:font-bold font-sans-text prose-quoteless prose-a:underline-offset-4 w-full text-sm font-normal leading-6 tracking-tight transition-colors duration-100 sm:text-base">
      <MDXRemote
        source={children}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkToc],
            rehypePlugins: [rehypeSlug]
          }
        }}
        components={components}
      />
    </div>
  )
}
