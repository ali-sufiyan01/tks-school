import { Link } from 'react-router-dom'
import { PageHead } from '../components/Parts.jsx'

export default function Soon() {
  return (
    <>
      <PageHead title="Coming next" lead="This page will be designed after the home page is approved." />
      <section><div className="c"><Link className="btn" to="/">Back to home page</Link></div></section>
    </>
  )
}