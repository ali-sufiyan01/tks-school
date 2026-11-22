import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Academics from './pages/Academics.jsx'
import Staff from './pages/Staff.jsx'
import Facilities from './pages/Facilities.jsx'
import Gallery from './pages/Gallery.jsx'
import Contact from './pages/Contact.jsx'
import Admissions from './pages/Admissions.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="academics" element={<Academics />} />
        <Route path="staff" element={<Staff />} />
        <Route path="facilities" element={<Facilities />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="contact" element={<Contact />} />
        <Route path="admissions" element={<Admissions />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
