import { school as s } from '../data/school.js'
import { PageHead, SectionHead, Stages, has } from '../components/Parts.jsx'

export default function Academics() {
  const ac = s.academics
  const blocks = [['Curriculum', ac.curriculum], ['Assessment', ac.assessment], ['Academic support', ac.support]].filter(([, v]) => has(v))
  const first = s.classes[0]?.name
  const last = s.classes[s.classes.length - 1]?.name
  return (
    <>
      <PageHead title="Academics" lead={first && last ? `Classes from ${first} to ${last}.` : undefined} desc={`Classes offered at ${s.name}, ${s.place}.`} />
      <section><div className="c">
        <SectionHead eyebrow="Classes" title="Classes offered" />
        <Stages />
      </div></section>
      {blocks.length > 0 && (
        <section className="tint"><div className="c">
          <SectionHead eyebrow="Learning" title="How we teach" />
          <div className="grid g3 stg">{blocks.map(([t, d]) => <article className="pt" key={t}><h3>{t}</h3><p>{d}</p></article>)}</div>
        </div></section>
      )}
    </>
  )
}
