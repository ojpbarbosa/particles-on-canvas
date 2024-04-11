export default async function sitemap() {
  const routes = ['', '/paper', '/generator'].map((route) => ({
    url: `https://particles-on-canvas.vercel.app${route}`,
    lastModified: new Date().toISOString().split('T')[0]
  }))

  return routes
}
