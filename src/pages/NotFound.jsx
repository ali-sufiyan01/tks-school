import { Link } from 'react-router-dom'
import { PageHead } from '../components/Parts.jsx'

export default function NotFound() {
  return (
    <>
      <PageHead title="Page not found" lead="The page you are looking for does not exist." />
      <section><div className="c"><Link className="btn" to="/">Back to home page</Link></div></section>
    </>
  )
}
