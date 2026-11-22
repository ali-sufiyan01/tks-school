import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Img from './Img.jsx'
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import Splash from './Splash.jsx'
import { school as s } from '../data/school.js'

const nav = [['/', 'Home'], ['/about', 'About'], ['/academics', 'Academics'], ['/staff', 'Staff'], ['/facilities', 'Facilities'], ['/gallery', 'Gallery'], ['/contact', 'Contact']]
  .filter(([to]) => to !== '/staff' || s.staff.length > 0) // Staff page tab tak chhupa jab tak teachers add na hon

export default function Layout() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const prog = useRef(null)

  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [pathname])

  useEffect(() => {
    const on = () => {
      setScrolled((was) => (was ? window.scrollY > 15 : window.scrollY > 60)) // do alag hadein, taake threshold par aa-ja kar blink na ho
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (prog.current) prog.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  // Har section scroll karte hi halka sa upar aa kar fade-in hota hai.
  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } })
    }, { threshold: 0.08 })
    document.querySelectorAll('main > *, .feat').forEach((el) => {
      if (el.classList.contains('hero')) return // hero ki apni entrance animation hai
      el.classList.add('rv'); io.observe(el)
    })
    return () => io.disconnect()
  }, [pathname])

  // Cards par halka 3D tilt (sirf mouse wale devices par)
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let cur = null
    const reset = (el) => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg') }
    const move = (e) => {
      const el = e.target.closest?.('.card, .why article')
      if (cur && cur !== el) reset(cur)
      cur = el
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 9}deg`)
      el.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - 0.5) * 9}deg`)
    }
    document.addEventListener('pointermove', move, { passive: true })
    return () => document.removeEventListener('pointermove', move)
  }, [])

  // Search engines ke liye school ki structured data
  useEffect(() => {
    const c = s.contact
    const data = {
      '@context': 'https://schema.org', '@type': 'School', name: s.name, url: window.location.origin,
      logo: `${window.location.origin}/logo.png`, foundingDate: String(s.since),
      parentOrganization: { '@type': 'Organization', name: s.trust },
      address: c.address || s.place, telephone: c.phone ? c.phone.replace(/\s/g, '').replace(/^0/, '+92') : undefined, email: c.email || undefined,
    }
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.textContent = JSON.stringify(data)
    document.head.appendChild(el)
    return () => el.remove()
  }, [])

  const wa = s.contact.whatsapp ? `https://wa.me/${s.contact.whatsapp}` : null
  return (
    <>
      <Splash />
      <header className={scrolled ? 'scrolled' : ''}>
        <div className="c bar">
          <Link className="brand" to="/" aria-label={`${s.name}, home`}>
            <Img src="/logo.png" alt="" eager sizes="80px" />
            <span>{s.name}<small>{s.place}. A project of {s.trust}</small></span>
          </Link>
          <button className="menu" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
          <nav id="nav" className={open ? 'open' : ''} aria-label="Main">
            {nav.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'}>{l}</NavLink>)}
            <Link className="btn" to="/admissions">Admission enquiry</Link>
          </nav>
        </div>
        <span className="prog" ref={prog} aria-hidden="true" />
      </header>
      <main key={pathname} className="page"><Outlet /></main>
      <footer>
        <div className="c fg">
          <div><Img src="/logo.png" alt={`${s.name} logo`} sizes="140px" /><p>A project of {s.trust}. Established {s.since}.</p></div>
          <div>
            <div className="fh">Explore</div>
            <ul>{nav.map(([to, l]) => <li key={to}><Link to={to}>{l}</Link></li>)}</ul>
          </div>
          <div>
            <div className="fh">Contact</div>
            <ul>
              {s.contact.address && <li>{s.contact.address}</li>}
              {s.contact.phone && <li><a href={`tel:${s.contact.phone.replace(/\s/g, '')}`}>{s.contact.phone}</a></li>}
              {s.contact.phone2 && <li><a href={`tel:${s.contact.phone2.replace(/\s/g, '')}`}>{s.contact.phone2}</a></li>}
              {s.contact.email && <li><a href={`mailto:${s.contact.email}`}>{s.contact.email}</a></li>}
              {s.contact.hours && <li>{s.contact.hours}</li>}
            </ul>
          </div>
        </div>
        <div className="c copy">© {new Date().getFullYear()} {s.name}</div>
      </footer>
      {wa
        ? <a className="wa" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp us</a>
        : <Link className="wa" to="/contact">Contact us</Link>}
    </>
  )
}
