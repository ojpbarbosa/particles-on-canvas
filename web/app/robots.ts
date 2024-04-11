export default function robots() {
  return {
    rules: [
      {
        userAgent: '*'
      }
    ],
    sitemap: 'https://particles-on-canvas.vercel.app/sitemap.xml',
    host: 'https://particles-on-canvas.vercel.app'
  }
}
