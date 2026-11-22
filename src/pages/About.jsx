import { school as s } from '../data/school.js'
import { PageHead, SectionHead, Why, has, nn } from '../components/Parts.jsx'
import Img from '../components/Img.jsx'

export default function About() {
  const a = s.about
  const p = s.principal
  const story = s.slides[1] || s.facilities[0]
  const campus = s.facilities.filter((f) => f.img && f.img !== story?.img).slice(0, 3)
  return (
    <>
      <PageHead title="About us" lead={`A project of ${s.trust}, serving ${s.place} since ${s.since}.`} desc={`About ${s.name}, ${s.place}: a project of ${s.trust}, established ${s.since}. Our mission, vision and values.`} />

      <section><div className="c two flip">
        {story?.img && (
          <figure className="arch sm">
            <Img src={story.img} alt={story.title || story.name} pos={story.pos} sizes="(min-width:960px) 400px, 80vw" />
            <figcaption className="badge"><b>Since {s.since}</b><span>A project of {s.trust}</span></figcaption>
          </figure>
        )}
        <div>
          <p className="eyebrow">Our story</p>
          <h2 className="big">{s.purpose.statement}</h2>
          <p>{has(a.history) ? a.history : `${s.name} is a project of ${s.trust}, established in ${s.since} in ${s.place}.`}</p>
          <p>{s.purpose.text}</p>
          <ul className="pts">
            <li><strong>Established</strong>{s.since}</li>
            <li><strong>Managed by</strong>{s.trust}</li>
            <li><strong>Location</strong>{s.place}</li>
          </ul>
        </div>
      </div></section>

      <section><div className="c">
        <SectionHead eyebrow="Our purpose" title="What guides us" />
        <div className="panel stg">
          {[['Mission', a.mission], ['Vision', a.vision], ['Values', a.values]].map(([t, d], i) => (
            <article key={t}><span className="n">{nn(i)}</span><h3>{t}</h3><p>{d}</p></article>
          ))}
        </div>
      </div></section>

      <section className="tint"><div className="c">
        <SectionHead eyebrow="Why us" title="Why parents choose us" />
        <Why />
      </div></section>

      {campus.length > 0 && (
        <section><div className="c">
          <SectionHead eyebrow="Campus" title="Our campus" link={['/facilities', 'See all facilities']} />
          <div className="strip stg">
            {campus.map((f) => <figure key={f.name}><Img src={f.img} alt={f.name} pos={f.pos} sizes="(min-width:700px) 33vw, 100vw" /><figcaption>{f.name}</figcaption></figure>)}
          </div>
        </div></section>
      )}

      {has(p.message) && (
        <section className="tint"><div className="c">
          <SectionHead eyebrow="Leadership" title="Message from the principal" />
          <figure className="quote"><p>“{p.message}”</p>{has(p.name) && <cite>{p.name}, Principal</cite>}</figure>
        </div></section>
      )}
    </>
  )
}
