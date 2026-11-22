import { school as s } from '../data/school.js'
import { PageHead, ContactRows, has } from '../components/Parts.jsx'
import EnquiryForm from '../components/EnquiryForm.jsx'

export default function Admissions() {
  const a = s.admission
  return (
    <>
      <PageHead title="Admission enquiry" lead={`Admissions open for ${s.session}. Fill in the form and the school office will get back to you.`} desc={`Admission enquiry for session ${s.session} at ${s.name}, ${s.place}.`} />
      <section><div className="c two top">
        <div><h2>Send an enquiry</h2><EnquiryForm kind="admission" /></div>
        <div className="side">
          {has(a.eligibility) && <><h3>Who can apply</h3><p>{a.eligibility}</p></>}
          {has(a.steps) && <><h3>How to apply</h3><ol className="steps">{a.steps.map((x) => <li key={x.t}><b>{x.t}</b>{x.d}</li>)}</ol></>}
          {has(a.documents) && <><h3>Documents needed</h3><ul className="plain">{a.documents.map((d) => <li key={d}>{d}</li>)}</ul></>}
          <h3>Visit the school office</h3>
          <ContactRows />
        </div>
      </div></section>
    </>
  )
}
