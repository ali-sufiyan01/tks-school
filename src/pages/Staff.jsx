import { school as s } from '../data/school.js'
import { Link } from 'react-router-dom'
import { PageHead, StaffGrid, Icon, has } from '../components/Parts.jsx'

export default function Staff() {
  return (
    <>
      <PageHead title="Our teachers" lead="The people who guide our students." desc={`Teachers and staff of ${s.name}, ${s.place}.`} />
      <section><div className="c">
        {has(s.staff) ? <StaffGrid list={s.staff} /> : <div className="empty"><Icon n="user" size={44} /><h3>Teacher profiles will be added here soon</h3><p>Photos and details of our teachers will appear on this page.</p><Link className="tl" to="/contact">Contact the school</Link></div>}
      </div></section>
    </>
  )
}
