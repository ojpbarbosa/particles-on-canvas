import matter from 'gray-matter'
import path from 'path'
import fs from 'fs/promises'
import { cache } from 'react'

export type Content = {
  type: 'paper'
  body: string
}

export const getContents = cache(async () => {
  const content = await fs.readdir('./content/')

  return Promise.all(
    content
      .filter((file) => path.extname(file) === '.mdx')
      .map(async (file) => {
        const fileName = file.split('.')[0]
        const filePath = `./content/${file}`
        const fileContent = await fs.readFile(filePath, 'utf8')
        const { data, content } = matter(fileContent)

        return { ...data, type: fileName, body: content } as Content
      })
  )
})

export async function getContent(type: Content['type']) {
  const contents = await getContents()
  return contents.find((content) => content.type === type)
}
