import { useEffect, useRef, useState } from 'react'
import { best } from './Img.jsx'
import { school } from '../data/school.js'

// Logo pehle beech mein, phir header ke logo ki jagah par ud kar jata hai.
// Session mein sirf ek baar chalta hai. Click ya tap se skip.
export default function Splash() {
  const [done, setDone] = useState(() => {
    try {
      return window.location.pathname !== '/' || !!sessionStorage.getItem('tks-splash') ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch { return false }
  })
  const [fly, setFly] = useState(false)
  const img = useRef(null)
  const timers = useRef([])

  const finish = () => {
    timers.current.forEach(clearTimeout)
    setDone(true)
  }

  useEffect(() => {
    if (done) return
    const root = document.documentElement
    root.classList.add('splashing', 'intro')
    try { sessionStorage.setItem('tks-splash', '1') } catch { /* ignore */ }

    timers.current = [
      setTimeout(() => {
        const from = img.current?.getBoundingClientRect()
        const to = document.querySelector('header .brand img')?.getBoundingClientRect()
        if (from && to && img.current) {
          const dx = to.left + to.width / 2 - (from.left + from.width / 2)
          const dy = to.top + to.height / 2 - (from.top + from.height / 2)
          const k = to.width / from.width
          img.current.style.transform = `translate(${dx}px, ${dy}px) scale(${k})`
        }
        setFly(true)
      }, 900),
      setTimeout(() => setDone(true), 1900),
    ]
    return () => {
      timers.current.forEach(clearTimeout)
      root.classList.remove('splashing', 'intro')
    }
  }, [done])

  if (done) return null
  return (
    <div
      className={fly ? 'splash fly' : 'splash'}
      onClick={finish}
      role="img"
      aria-label={`${school.name}, a project of ${school.trust}`}
    >
      <div>
        <img ref={img} src={best('/logo.png', 540)} alt="" width="270" height="270" />
        <small>Tap to skip</small>
      </div>
    </div>
  )
}
