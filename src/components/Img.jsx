import manifest from '../data/images.json'

// Chhoti se chhoti variant jo kam az kam `w` pixels chaudi ho (warna sab se bari).
export function best(src, w) {
  const m = manifest[src]
  if (!m) return src
  return `${m.dir}-${m.widths.find((x) => x >= w) ?? m.widths[m.widths.length - 1]}.webp`
}

// Natural width (px) of a photo, ya undefined agar pata na ho.
export const naturalSize = (src) => manifest[src]

// Optimised <img>: WebP srcset (phone par chhoti file), blur placeholder, lazy loading.
// `pos` = focal point (CSS object-position), jaise '50% 20%'.
export default function Img({ src, alt = '', sizes = '100vw', eager = false, pos, style, ...rest }) {
  const m = manifest[src]
  const st = pos ? { ...style, objectPosition: pos } : style
  if (!m) return <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" style={st} {...rest} />
  return (
    <img
      src={best(src, 1200)}
      srcSet={m.widths.map((w) => `${m.dir}-${w}.webp ${w}w`).join(', ')}
      sizes={sizes}
      width={m.w}
      height={m.h}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
      style={{ backgroundImage: `url(${m.blur})`, backgroundSize: 'cover', backgroundPosition: 'center', ...st }}
      {...rest}
    />
  )
}
