import { useEffect, useRef, useState } from 'react'
import Img from './Img.jsx'

export default function Carousel({ slides }) {
  const n = slides.length
  const [i, setI] = useState(0)
  const [play, setPlay] = useState(true)
  const [hover, setHover] = useState(false)
  const x0 = useRef(null)
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const go = (k) => setI((k + n) % n)

  useEffect(() => {
    if (!play || hover || reduce) return
    const t = setInterval(() => setI((x) => (x + 1) % n), 5000)
    return () => clearInterval(t)
  }, [play, hover, reduce, n])

  return (
    <div className="c">
      <section
        className="slider"
        aria-roledescription="carousel"
        aria-label="School photos"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1) }}
        onTouchStart={(e) => { x0.current = e.touches[0].clientX }}
        onTouchEnd={(e) => {
          if (x0.current === null) return
          const d = e.changedTouches[0].clientX - x0.current
          if (Math.abs(d) > 40) go(i + (d < 0 ? 1 : -1))
          x0.current = null
        }}
      >
        <div className="track" style={{ transform: `translateX(-${i * 100}%)` }}>
          {slides.map((s, k) => (
            <figure className={k === i ? 'slide on' : 'slide'} key={s.title} role="group" aria-roledescription="slide" aria-label={`${k + 1} of ${n}`} aria-hidden={k !== i}>
              {s.img
                ? <Img src={s.img} alt={s.title} pos={s.pos} sizes="(min-width:1200px) 1120px, 100vw" />
                : <div className="ph" role="img" aria-label={`Placeholder photo: ${s.title}`}>Photo coming soon</div>}
              <figcaption><b>{s.title}</b><span>{s.text}</span></figcaption>
            </figure>
          ))}
        </div>
        <button className="sl-btn prev" onClick={() => go(i - 1)} aria-label="Previous photo">‹</button>
        <button className="sl-btn next" onClick={() => go(i + 1)} aria-label="Next photo">›</button>
        <div className="sl-bar">
          {slides.map((s, k) => (
            <button key={s.title} className={k === i ? 'dot on' : 'dot'} onClick={() => go(k)} aria-label={`Show photo ${k + 1}`} aria-current={k === i} />
          ))}
          <button className="pp" onClick={() => setPlay(!play)}>{play ? 'Pause' : 'Play'}</button>
        </div>
      </section>
    </div>
  )
}