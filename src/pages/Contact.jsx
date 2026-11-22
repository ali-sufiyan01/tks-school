import { school as s } from '../data/school.js'
import { PageHead, ContactRows } from '../components/Parts.jsx'
import EnquiryForm from '../components/EnquiryForm.jsx'

export default function Contact() {
  return (
    <>
      <PageHead title="Contact us" lead={`${s.name}, ${s.place}`} desc={`Address, phone and enquiry form for ${s.name}, ${s.place}.`} />
      <section><div className="c two top">
        <div><p className="eyebrow">Visit or call</p><h2>School office</h2><ContactRows /></div>
        <div><p className="eyebrow">Write to us</p><h2>Send a question</h2><EnquiryForm kind="contact" /></div>
      </div></section>
    </>
  )
}
