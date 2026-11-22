import { useEffect } from 'react'
import { school as s } from '../data/school.js'

export function useTitle(t, desc) {
  useEffect(() => {
    document.title = t === s.name ? t : `${t} | ${s.name}`
    if (!desc) return
    let m = document.querySelector('meta[name="description"]')
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) }
    m.content = desc
  }, [t, desc])
}
