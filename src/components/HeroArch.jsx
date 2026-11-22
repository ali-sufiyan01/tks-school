import { useEffect, useRef, useState } from 'react'
import { school as s } from '../data/school.js'
import Img, { naturalSize } from './Img.jsx'

// Hero ki arch wali photo: photos crossfade hoti hain, stat cards tairte hain,
// aur mouse ke saath halki parallax. Reduced-motion par sab band.
export default function HeroArch() {
  // Arch lambi hai, is liye bahut chhoti photos (height < 500px) is mein nahi chalti
  const all = s.slides.filter((x) => x.img)
  const sharp = all.filter((x) => (naturalSize(x.img)?.h ?? 9999) >= 500)
  const pics = (sharp.length ? sharp : all.slice(0, 1)).slice(0, 4)
  const [i, setI] = useState(0)
  const stage = useRef(null)
  const [a, b, , d] = s.stats

  useEffect(() => {
    if (pics.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((x) => (x + 1) % pics.length), 4800)
    return () => clearInterval(t)
  }, [pics.length])

  useEffect(() => {
    const el = stage.current
    const host = el?.closest('.hero')
    if (!host || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let raf = 0
    const move = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = host.getBoundingClientRect()
        el.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5) * 2)
        el.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5) * 2)
      })
    }
    const leave = () => { el.style.setProperty('--px', 0); el.style.setProperty('--py', 0) }
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerleave', leave)
    return () => { cancelAnimationFrame(raf); host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave) }
  }, [])

  if (!pics.length) return null
  return (
    <div className="stage fx" ref={stage} style={{ '--d': '.3s' }}>
      <i className="ring" aria-hidden="true" />
      <i className="orb" aria-hidden="true" />
      <figure className="arch">
        <div className="arch-img">
          {pics.map((p, k) => (
            <Img key={p.img} className={k === i ? 'on' : ''} src={p.img} pos={p.pos} alt={k === i ? p.title : ''} aria-hidden={k !== i} eager={k === 0} sizes="(min-width:960px) 430px, 90vw" />
          ))}
          <span className="cap" key={i}>{pics[i].title}</span>
        </div>
        <div className="dots" role="group" aria-label="Choose photo">
          {pics.map((p, k) => <button key={p.img} type="button" className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`Show photo ${k + 1}: ${p.title}`} aria-current={k === i} />)}
        </div>
      </figure>
      {a && <div className="chip c1"><b>{a.n}</b><span>{a.l}</span></div>}
      {b && <div className="chip c2 red"><b>{b.n}</b><span>{b.l}</span></div>}
      {d && <div className="chip c3"><b>{d.n}</b><span>{d.l}</span></div>}
    </div>
  )
}
