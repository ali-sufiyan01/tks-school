import { Link } from 'react-router-dom'
import { school as s } from '../data/school.js'
import { useTitle } from '../hooks/useTitle.js'
import { Facilities, StaffGrid, Honour, SectionHead, Why, Stages, Marquee, CountUp, has, nn } from '../components/Parts.jsx'
import Carousel from '../components/Carousel.jsx'
import HeroArch from '../components/HeroArch.jsx'

export default function Home() {
  useTitle(s.name, `${s.name}, ${s.place}. ${s.heroText}`)
  const a = s.about
  const [t1, t2] = s.tagline.split(/,\s*/)
  const first = s.classes[0]?.name
  const last = s.classes[s.classes.length - 1]?.name
  const showQuote = has(s.testimonial.text)
  const showHonour = has(s.honour)
  return (
    <>
      <section className="hero">
        <i className="sp s1" aria-hidden="true" /><i className="sp s2" aria-hidden="true" /><i className="sp s3" aria-hidden="true" />
        <div className="c hero-grid">
          <div>
            <p className="eyebrow fx" style={{ '--d': '.1s' }}>{s.place} · Since {s.since}</p>
            <h1>
              {t2 ? (
                <>
                  <span className="ln"><span style={{ '--d': '.2s' }}>{t1},</span></span>
                  <em className="u">
                    <span className="ln"><span style={{ '--d': '.4s' }}>{t2}</span></span>
                    <svg className="squig" viewBox="0 0 320 14" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M3 9 C 40 1, 70 15, 110 8 S 190 1, 230 8 S 295 14, 317 5" /></svg>
                  </em>
                </>
              ) : <span className="ln"><span>{s.tagline}</span></span>}
            </h1>
            <p className="lead fx" style={{ '--d': '.7s' }}>{s.heroText}</p>
            <div className="acts fx" style={{ '--d': '.9s' }}>
              <Link className="btn" to="/about">Explore the school</Link>
              <Link className="tl" to="/academics">View classes</Link>
            </div>
          </div>
          <HeroArch />
        </div>
      </section>

      <Marquee />
      <div className="facts stg">{s.stats.map((x) => <div key={x.l}><b><CountUp value={x.n} /></b><span>{x.l}</span></div>)}</div>

      <section><div className="c two">
        <div>
          <p className="eyebrow">Who we are</p>
          <h2 className="big">{s.purpose.statement}</h2>
          <p>{s.purpose.text}</p>
          <Link className="tl" to="/about">More about us</Link>
        </div>
        <ol className="mvl stg">
          {[['Mission', a.mission], ['Vision', a.vision], ['Values', a.values]].map(([t, d], i) => (
            <li key={t}><span className="n">{nn(i)}</span><div><strong>{t}</strong>{d}</div></li>
          ))}
        </ol>
      </div></section>

      <section className="tint"><div className="c">
        <SectionHead eyebrow="Why us" title="Why parents choose us" />
        <Why />
      </div></section>

      <section><div className="c">
        <SectionHead eyebrow="Classes" title="Classes offered" lead={first && last ? `${first} to ${last}, step by step.` : undefined} link={['/academics', 'All academics']} />
        <Stages />
      </div></section>

      <section className="tint"><div className="c">
        <SectionHead eyebrow="Campus" title="Everything a school day needs, on one campus" link={['/facilities', 'All facilities']} />
        <Facilities list={s.facilities} />
      </div></section>

      <section>
        <div className="c"><SectionHead eyebrow="Gallery" title="A look inside" link={['/gallery', 'Full gallery']} /></div>
        <Carousel slides={s.slides} />
      </section>

      {has(s.staff) && (
        <section className="tint"><div className="c">
          <SectionHead eyebrow="Teachers" title="Our teachers" link={['/staff', 'All teachers']} />
          <StaffGrid list={s.staff} />
        </div></section>
      )}

      {(showQuote || showHonour) && (
        <section><div className={showQuote && showHonour ? 'c two' : 'c'}>
          {showQuote && <div><SectionHead eyebrow="Achievements" title="Proud moments" /><figure className="quote"><p>“{s.testimonial.text}”</p><cite>{s.testimonial.by}</cite></figure></div>}
          {showHonour && <Honour />}
        </div></section>
      )}
    </>
  )
}
