import { useMemo, useRef, useState } from 'react'
import { school as s } from '../data/school.js'
import { PageHead, has } from '../components/Parts.jsx'
import Img, { naturalSize } from '../components/Img.jsx'

// s.gallery ({ img, alt, caption, cat, pos }) khali ho to slider aur facilities ki photos dikhti hain.
function photos() {
  if (has(s.gallery)) return s.gallery
  const all = [
    ...s.slides.map((x) => ({ img: x.img, alt: x.title, caption: x.text, cat: 'Campus', pos: x.pos })),
    ...s.facilities.map((x) => ({ img: x.img, alt: x.name, caption: x.text, cat: 'Facilities', pos: x.pos })),
  ].filter((x) => x.img)
  return all.filter((x, i) => all.findIndex((y) => y.img === x.img) === i)
}

export default function Gallery() {
  const all = useMemo(() => photos(), [])
  const cats = [...new Set(all.map((g) => g.cat).filter(Boolean))]
  const [cat, setCat] = useState('All')
  const list = cat === 'All' ? all : all.filter((g) => g.cat === cat)
  const n = list.length
  const [cur, setCur] = useState(null)
  const dlg = useRef(null)
  const open = (i) => { setCur(i); dlg.current?.showModal() }
  const close = () => dlg.current?.close()
  const go = (d) => setCur((c) => (c + d + n) % n)
  const onKey = (e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }
  const cap = cur !== null ? naturalSize(list[cur].img) : null
  return (
    <>
      <PageHead title="Gallery" lead="A look at life at our school." desc={`Photos of ${s.name}, ${s.place}.`} />
      <section><div className="c">
        {cats.length > 1 && (
          <div className="fchips" role="group" aria-label="Filter photos">
            {['All', ...cats].map((c) => <button key={c} type="button" className="fchip" aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>)}
          </div>
        )}
        <ul className="gal stg" key={cat}>
          {list.map((g, i) => (
            <li key={`${g.img}-${i}`}>
              <button type="button" onClick={() => open(i)} aria-label={`View larger: ${g.alt}`}>
                <Img src={g.img} alt={g.alt} pos={g.pos} sizes={i === 0 ? '(min-width:700px) 50vw, 100vw' : '(min-width:700px) 25vw, 50vw'} />
                <span className="gcap">{g.alt}</span>
              </button>
            </li>
          ))}
        </ul>
        <dialog ref={dlg} className="lb" aria-label="Photo viewer" onClose={() => setCur(null)} onKeyDown={onKey} onClick={(e) => e.target === dlg.current && close()}>
          {cur !== null && (
            <div className="lb-in">
              <figure key={cur} style={cap && cap.w < 1000 ? { maxWidth: Math.max(480, cap.w * 1.6), marginInline: 'auto' } : undefined}>
                <Img src={list[cur].img} alt={list[cur].alt} pos={list[cur].pos} eager sizes="(min-width:1060px) 1000px, 94vw" />
                <figcaption>{list[cur].caption || list[cur].alt}</figcaption>
              </figure>
              {n > 1 && <button type="button" className="lb-btn lb-prev" onClick={() => go(-1)} aria-label="Previous photo">‹</button>}
              {n > 1 && <button type="button" className="lb-btn lb-next" onClick={() => go(1)} aria-label="Next photo">›</button>}
              <button type="button" className="lb-x" onClick={close} aria-label="Close">×</button>
              <p className="lb-count">{cur + 1} / {n}</p>
            </div>
          )}
        </dialog>
      </div></section>
    </>
  )
}
