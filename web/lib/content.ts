import matter from 'gray-matter'
import path from 'path'
import fs from 'fs/promises'
import { cache } from 'react'

export type Content = {
  slug: string
  body: string
  kind: string
  [key: string]: string
}

async function readFilesRecursively(directory: string, base: string = ''): Promise<Content[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = entries.filter(
    (entry) =>
      entry.isFile() && (path.extname(entry.name) === '.mdx' || path.extname(entry.name) === '.md')
  )
  const directories = entries.filter((entry) => entry.isDirectory())

  const fileData = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(directory, file.name)
      const fileContent = await fs.readFile(filePath, 'utf8')
      const { data, content } = matter(fileContent)
      const slug = file.name.split('.')[0]
      const kind = base || slug

      return { ...data, slug, kind, body: content }
    })
  )

  const directoryData = await Promise.all(
    directories.map((subDirectory) =>
      readFilesRecursively(
        path.join(directory, subDirectory.name),
        path.join(base, subDirectory.name)
      )
    )
  )

  return [...fileData, ...directoryData.flat()]
}

export const getContent = cache(async () => {
  const directory = './content/'
  const content = await readFilesRecursively(directory)

  return content
})

export const getPaper = async () => (await getContent()).find((content) => content.kind === 'paper')

export const getMission = async () =>
  (await getContent()).find((content) => content.kind === 'mission')

export const getSignatures = async () =>
  (await getContent()).filter((content) => content.kind === 'gallery')

export const getSignature = async (slug: string) =>
  (await getSignatures()).find((content) => content.slug === slug)
