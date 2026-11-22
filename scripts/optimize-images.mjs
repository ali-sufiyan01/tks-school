// Har photo ke chhote-bade WebP versions + blur placeholder banata hai aur src/data/images.json likhta hai.
// public/images/ mein koi bhi bari photo (JPG/PNG) daal do, baaki yeh khud sambhal leta hai.
// Chalane ke liye: npm run images  (dev aur build se pehle khud chalta hai)
import sharp from 'sharp'
import { readdir, mkdir, writeFile, stat, access } from 'node:fs/promises'
import path from 'node:path'

const OUT = 'public/images/_opt'
const WIDTHS = [320, 480, 640, 800, 1200, 1600, 2000]
const OK = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const exists = (p) => access(p).then(() => true, () => false)
const newer = async (a, b) => (await exists(a)) && (await stat(a)).mtimeMs >= (await stat(b)).mtimeMs

const sources = (await readdir('public/images')).filter((f) => OK.has(path.extname(f).toLowerCase())).map((f) => `/images/${f}`)
if (await exists('public/logo.png')) sources.push('/logo.png')
await mkdir(OUT, { recursive: true })

const manifest = {}
const small = []
let made = 0
for (const url of sources) {
  const file = path.join('public', url)
  const meta = await sharp(file).metadata()
  const swap = (meta.orientation || 1) >= 5
  const W = swap ? meta.height : meta.width
  const H = swap ? meta.width : meta.height
  const isLogo = url === '/logo.png'
  const cap = isLogo ? 540 : 2000
  const base = path.basename(url, path.extname(url))
  const widths = [...new Set([...WIDTHS.filter((w) => w < Math.min(W, cap) * 0.95), Math.min(W, cap)])].filter((w) => !isLogo || w >= 160).sort((a, b) => a - b)
  for (const w of widths) {
    const out = path.join(OUT, `${base}-${w}.webp`)
    if (await newer(out, file)) continue
    await sharp(file).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: isLogo ? 85 : 78 }).toFile(out)
    made++
  }
  const blur = await sharp(file).rotate().resize(20).blur(1).webp({ quality: 40 }).toBuffer()
  manifest[url] = { w: W, h: H, dir: `/images/_opt/${base}`, widths, blur: `data:image/webp;base64,${blur.toString('base64')}` }
  if (!isLogo && W < 1000) small.push(`${path.basename(url)} (${W}px)`)
}
if (await exists('public/logo.png') && !(await newer('public/favicon.png', 'public/logo.png'))) {
  await sharp('public/logo.png').resize(192, 192).png().toFile('public/favicon.png')
}
await writeFile('src/data/images.json', JSON.stringify(manifest, null, 1) + '\n')
console.log(`images: ${sources.length} photo(s), ${made} new WebP file(s)`)
if (small.length) console.warn(`  Low resolution (blurry on big screens): ${small.join(', ')}. Use photos at least 1400px wide.`)
