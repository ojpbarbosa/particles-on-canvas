import { cache } from 'react'

export const getVersion = cache(async () => {
  const data = await fetch(
    `https://api.github.com/repos/ojpbarbosa/particles-on-canvas/contents/web/package.json`,
    {
      headers: {
        Accept: 'application/vnd.github.v3.raw'
      },
      next: {
        revalidate: 0
      }
    }
  ).then((response) => response.json())

  return data.version
})
