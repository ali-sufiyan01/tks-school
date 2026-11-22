// sitemap.xml aur robots.txt banata hai. Address VITE_SITE_URL se aata hai (.env ya hosting ki settings).
import { readFile, writeFile } from 'node:fs/promises'

let site = process.env.VITE_SITE_URL
if (!site) {
  try {
    const env = await readFile('.env', 'utf8')
    site = env.match(/^VITE_SITE_URL=(.+)$/m)?.[1]?.trim()
  } catch { /* .env nahi hai */ }
}
if (!site) {
  console.warn('seo: VITE_SITE_URL set nahi hai, sitemap nahi bana. .env.example dekhein.')
  process.exit(0)
}
site = site.replace(/\/+$/, '')
const pages = ['', '/about', '/academics', '/facilities', '/gallery', '/contact', '/admissions']
const today = new Date().toISOString().slice(0, 10)
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${site}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`
await writeFile('public/sitemap.xml', xml)
await writeFile('public/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`)
console.log(`seo: sitemap.xml + robots.txt (${site})`)
