import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Mascot from './Mascot'
import VoiceSettings from './VoiceSettings'
import { isSectionUnlocked } from '../utils/unlocks'
import { getEquippedAccessoryEmoji } from '../utils/accessories'

const links = [
  { to: '/', label: 'Home', end: true, category: null },
  { to: '/alphabet', label: 'Alphabet', category: 'alphabet' },
  { to: '/phonics', label: 'Phonics', category: 'phonics' },
  { to: '/words', label: 'Words', category: 'words' },
  { to: '/sentences', label: 'Sentences', category: 'sentences' },
  { to: '/progress', label: 'My Progress', category: null },
]

export default function Navbar() {
  const [accessory, setAccessory] = useState(null)

  useEffect(() => {
    setAccessory(getEquippedAccessoryEmoji())
  }, [])

  return (
    <header className="navbar">
      <NavLink to="/" className="navbar__brand" end>
        <Mascot size={44} accessory={accessory} />
        <span className="navbar__brand-text">Read With Me</span>
      </NavLink>
      <nav className="navbar__links">
        {links.map((link) => {
          const locked = link.category ? !isSectionUnlocked(link.category) : false
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              {locked && <span className="navbar__lock" aria-hidden="true">🔒</span>}
              {link.label}
            </NavLink>
          )
        })}
      </nav>
      <VoiceSettings />
    </header>
  )
}
