import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Alphabet from './pages/Alphabet'
import Phonics from './pages/Phonics'
import Words from './pages/Words'
import Sentences from './pages/Sentences'
import Progress from './pages/Progress'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Navbar />
      <main className="app__main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alphabet" element={<Alphabet />} />
          <Route path="/phonics" element={<Phonics />} />
          <Route path="/words" element={<Words />} />
          <Route path="/sentences" element={<Sentences />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
      </main>
      <footer className="app__footer">
        Made with 💛 for little readers · Your progress is saved on this device only
      </footer>
    </div>
  )
}
