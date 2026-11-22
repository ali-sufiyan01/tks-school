import { useState } from 'react'
import { school as s } from '../data/school.js'

// Component bahar define hai, warna har keystroke par input remount hota hai aur focus chala jata hai.
function F({ kind, k, label, type = 'text', value, onChange, error, children }) {
  return (
    <div className="field">
      <label htmlFor={`${kind}-${k}`}>{label}</label>
      {children || <input id={`${kind}-${k}`} type={type} value={value} onChange={onChange} aria-invalid={!!error} aria-describedby={error ? `${kind}-${k}-e` : undefined} />}
      {error && <span className="err" id={`${kind}-${k}-e`}>{error}</span>}
    </div>
  )
}

// Backend nahi hai: valid form WhatsApp (ya email) mein message pehle se likha hua kholta hai.
// kind = 'admission' (student ki detail) ya 'contact' (chhota sawal).
export default function EnquiryForm({ kind = 'admission' }) {
  const adm = kind === 'admission'
  const [v, setV] = useState({})
  const [err, setErr] = useState({})
  const [done, setDone] = useState('')
  const [sending, setSending] = useState(false)
  const [fail, setFail] = useState('')
  const [bot, setBot] = useState('')
  const wa = (s.contact.whatsapp || '').replace(/\D/g, '')
  const mail = s.contact.email
  const key = import.meta.env.VITE_WEB3FORMS_KEY
  const canSend = Boolean(key || wa || mail)
  const val = (k) => v[k] || ''
  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    const x = {}
    const short = (k) => val(k).trim().length < 2
    if (adm) {
      if (short('student')) x.student = 'Enter the student’s name.'
      if (short('parent')) x.parent = 'Enter the parent or guardian’s name.'
      if (!val('grade')) x.grade = 'Choose a class.'
    } else {
      if (short('name')) x.name = 'Enter your name.'
      if (val('message').trim().length < 5) x.message = 'Write your question (at least 5 characters).'
    }
    if (!/^[+\d][\d\s-]{6,}$/.test(val('phone').trim())) x.phone = 'Enter a valid phone number.'
    setErr(x)
    if (Object.keys(x).length || !canSend) return

    const text = adm
      ? `Assalam o Alaikum. Admission enquiry for session ${s.session}.\nStudent: ${val('student').trim()}\nParent: ${val('parent').trim()}\nClass: ${val('grade')}\nPhone: ${val('phone').trim()}${val('message').trim() ? `\n${val('message').trim()}` : ''}`
      : `Assalam o Alaikum, I am ${val('name').trim()} (${val('phone').trim()}). ${val('message').trim()}`
    setFail('')
    if (key) {
      if (bot) return // spam bot ne hidden field bhar di
      setSending(true)
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: key,
            subject: adm ? `New admission enquiry (${s.session})` : 'New question from website',
            from_name: s.name,
            ...(adm
              ? { student: val('student').trim(), parent: val('parent').trim(), class: val('grade') }
              : { name: val('name').trim() }),
            phone: val('phone').trim(),
            message: val('message').trim() || '-',
          }),
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.message || 'failed')
        setDone('Thank you. Your enquiry has been sent. The school office will contact you soon.')
        setV({})
      } catch {
        setFail(`Could not send right now. Please call ${s.contact.phone || 'the school office'} or try again.`)
      } finally {
        setSending(false)
      }
      return
    }
    if (wa) {
      window.open(`https://wa.me/${wa}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
      setDone('WhatsApp has opened with your message. Press send there to finish.')
    } else {
      window.location.href = `mailto:${mail}?subject=${encodeURIComponent(adm ? 'Admission enquiry' : 'Question')}&body=${encodeURIComponent(text)}`
      setDone('Your email app has opened with your message. Press send there to finish.')
    }
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <p className="note">{key ? 'Fill in the form and press send. The school office receives it directly.' : canSend ? 'This form opens WhatsApp or your email app with your message ready to send. Nothing is sent automatically.' : 'Online enquiries are not switched on yet. Please call or visit the school office.'}</p>
      {adm ? (
        <>
          <F kind={kind} k="student" label="Student name" value={val('student')} onChange={set('student')} error={err.student} />
          <F kind={kind} k="parent" label="Parent or guardian name" value={val('parent')} onChange={set('parent')} error={err.parent} />
          <F kind={kind} k="phone" label="Phone number" type="tel" value={val('phone')} onChange={set('phone')} error={err.phone} />
          <F kind={kind} k="grade" label="Class applying for" value={val('grade')} onChange={set('grade')} error={err.grade}>
            <select id="admission-grade" value={val('grade')} onChange={set('grade')} aria-invalid={!!err.grade} aria-describedby={err.grade ? 'admission-grade-e' : undefined}>
              <option value="">Choose a class</option>
              {s.classes.map((c) => <option key={c.name} value={`${c.name} (${c.level})`}>{c.name} ({c.level})</option>)}
            </select>
          </F>
          <F kind={kind} k="message" label="Message (optional)" value={val('message')} onChange={set('message')} error={err.message}>
            <textarea id="admission-message" rows="3" value={val('message')} onChange={set('message')} />
          </F>
        </>
      ) : (
        <>
          <F kind={kind} k="name" label="Your name" value={val('name')} onChange={set('name')} error={err.name} />
          <F kind={kind} k="phone" label="Phone number" type="tel" value={val('phone')} onChange={set('phone')} error={err.phone} />
          <F kind={kind} k="message" label="Your question" value={val('message')} onChange={set('message')} error={err.message}>
            <textarea id="contact-message" rows="4" value={val('message')} onChange={set('message')} aria-invalid={!!err.message} aria-describedby={err.message ? 'contact-message-e' : undefined} />
          </F>
        </>
      )}
      <input type="text" name="botcheck" value={bot} onChange={(e) => setBot(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
      <button className="btn" type="submit" disabled={!canSend || sending}>{sending ? 'Sending…' : adm ? 'Send admission enquiry' : 'Send question'}</button>
      {fail && <p className="err" role="alert">{fail}</p>}
      {done && <p className="ok" role="status">{done}</p>}
    </form>
  )
}
