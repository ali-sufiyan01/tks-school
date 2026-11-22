import { school as s } from '../data/school.js'
import { PageHead, nn } from '../components/Parts.jsx'
import Img from '../components/Img.jsx'

export default function FacilitiesPage() {
  return (
    <>
      <PageHead title="Facilities" lead="Spaces that support learning every day." desc={`Classrooms, library, science lab and computer lab at ${s.name}, ${s.place}.`} />
      <section><div className="c feats">
        {s.facilities.map((f, i) => (
          <article className={i % 2 ? 'feat rev' : 'feat'} key={f.name}>
            <figure className="feat-img">
              <div className="fi">
                {f.img ? <Img src={f.img} alt={f.name} pos={f.pos} sizes="(min-width:960px) 540px, 92vw" /> : <div className="ph" role="img" aria-label={`Placeholder photo: ${f.name}`}>Photo</div>}
              </div>
              <span className="feat-n" aria-hidden="true">{nn(i)}</span>
            </figure>
            <div>
              <p className="eyebrow">Facility {nn(i)}</p>
              <h2>{f.name}</h2>
              <p className="lead">{f.text}</p>
            </div>
          </article>
        ))}
      </div></section>
    </>
  )
}
