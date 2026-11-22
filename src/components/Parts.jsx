import { useEffect, useRef } from 'react'
import Img from './Img.jsx'
import { Link } from 'react-router-dom'
import { school as s } from '../data/school.js'
import { useTitle } from '../hooks/useTitle.js'

export const has = (v) => (Array.isArray(v) ? v.length > 0 : typeof v === 'string' && v.trim() !== '')

export const nn = (i) => String(i + 1).padStart(2, '0')

export function PageHead({ title, lead, desc }) {
  useTitle(title, desc)
  return (
    <div className="ph-head"><div className="c">
      <p className="crumb"><Link to="/">Home</Link><span aria-hidden="true"> / </span>{title}</p>
      <h1>{title}</h1>
      {lead && <p className="ph-lead">{lead}</p>}
    </div></div>
  )
}

export function SectionHead({ eyebrow, title, lead, link }) {
  return (
    <div className="sh">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {lead && <p className="lead">{lead}</p>}
      </div>
      {link && <Link className="tl" to={link[0]}>{link[1]}</Link>}
    </div>
  )
}

export function Card({ img, pos, title, children }) {
  return (
    <article className="card">
      {img
        ? <Img src={img} alt={title} pos={pos} sizes="(min-width:960px) 25vw, (min-width:700px) 45vw, 100vw" />
        : <div className="ph" role="img" aria-label={`Placeholder photo: ${title}`}>Photo</div>}
      <div><h3>{title}</h3><p>{children}</p></div>
    </article>
  )
}

export const Facilities = ({ list }) => (
  <div className="grid g4 stg">{list.map(f => <Card key={f.name} img={f.img} pos={f.pos} title={f.name}>{f.text}</Card>)}</div>
)
export const StaffGrid = ({ list }) => (
  <div className="grid g3 stg">{list.map(t => <Card key={t.name} img={t.photo} pos={t.pos || '50% 20%'} title={t.name}>{t.role}<br />{t.qual}</Card>)}</div>
)
export const Honour = () => (
  <div className="honour">{s.honour.map(h => <article key={h.title}><div className="big">{h.big}</div><h3>{h.title}</h3><p>{h.text}</p></article>)}</div>
)


const ICONS = {
  pin: <><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  map: <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></>,
}
export const Icon = ({ n, size = 22 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[n]}</svg>
)

export function ContactRows() {
  const c = s.contact
  // mapUrl khali ho to address se Google Maps search link banta hai
  const mapLink = c.mapUrl || (c.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.address}, ${s.place}`)}` : '')
  const items = [
    ['pin', 'Address', c.address, c.address, null],
    ['phone', 'Phone', c.phone, c.phone, `tel:${(c.phone || '').replace(/\s/g, '')}`],
    ['phone', 'Phone 2', c.phone2, c.phone2, `tel:${(c.phone2 || '').replace(/\s/g, '')}`],
    ['mail', 'Email', c.email, c.email, `mailto:${c.email}`],
    ['clock', 'Office hours', c.hours, c.hours, null],
    ['map', 'Find us', mapLink, 'Open in Google Maps', mapLink],
  ].filter(([, , v]) => has(v))
  return (
    <div className="ccards stg">
      {items.map(([ic, label, , text, href]) => {
        const inner = <><span className="ci"><Icon n={ic} /></span><span><small>{label}</small><b>{text}</b></span></>
        return href
          ? <a className="cc" key={label} href={href} {...(ic === 'map' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{inner}</a>
          : <div className="cc" key={label}>{inner}</div>
      })}
    </div>
  )
}

export const Why = () => (
  <div className="why stg">{s.points.map((x, i) => <article key={x.t}><span className="n">{nn(i)}</span><h3>{x.t}</h3><p>{x.d}</p></article>)}</div>
)

export const Stages = () => (
  <ol className="stages stg">{s.classes.map((c, i) => <li key={c.name}><span className="sn">{nn(i)}</span><span className="lvl">{c.level}</span><h3>{c.name}</h3><p>{c.text}</p></li>)}</ol>
)

export function Marquee() {
  const items = [...s.points.map((x) => x.t), ...s.classes.map((c) => c.name)]
  return (
    <div className="marquee" aria-hidden="true"><div className="mq">
      {[0, 1].map((k) => <ul key={k}>{items.map((x) => <li key={x}>{x}</li>)}</ul>)}
    </div></div>
  )
}

// Sirf digits wali value (jaise "2008") scroll par 0 se ginti karti hai; baaki text jaisa hai waisa.
export function CountUp({ value }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !/^\d{1,3}$/.test(value) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const n = Number(value)
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = (now) => {
        const k = Math.min(1, (now - t0) / 1500)
        el.textContent = String(Math.round(n * (1 - Math.pow(1 - k, 3))))
        if (k < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.6 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [value])
  return <span ref={ref}>{value}</span>
}
