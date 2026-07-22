import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Mascot from '../components/Mascot'
import ProgressSummary from '../components/ProgressSummary'
import CarAvatar from '../components/CarAvatar'
import { getCategoryCount, getTotalStars } from '../utils/progress'
import { alphabet } from '../data/alphabet'
import { phonicsGroups } from '../data/phonics'
import { wordCategories } from '../data/words'
import { sentences } from '../data/sentences'

const wordsTotal = wordCategories.reduce((sum, c) => sum + c.items.length, 0)

const sections = [
  {
    to: '/alphabet',
    accent: 'coral',
    emoji: '🔤',
    title: 'Alphabet',
    blurb: 'Meet all 26 letters, hear their sounds, and see a picture for each one.',
    category: 'alphabet',
    total: alphabet.length,
  },
  {
    to: '/phonics',
    accent: 'sky',
    emoji: '🎵',
    title: 'Phonics',
    blurb: 'Practice letter sounds, blends, and digraphs with fun word groups.',
    category: 'phonics',
    total: phonicsGroups.length,
  },
  {
    to: '/words',
    accent: 'grass',
    emoji: '🧩',
    title: 'Simple Words',
    blurb: 'Learn everyday words about animals, colors, family, and food.',
    category: 'words',
    total: wordsTotal,
  },
  {
    to: '/sentences',
    accent: 'grape',
    emoji: '📖',
    title: 'Sentences',
    blurb: 'Read short sentences out loud, one word at a time.',
    category: 'sentences',
    total: sentences.length,
  },
]

export default function Home() {
  const [stars, setStars] = useState(0)
  const [counts, setCounts] = useState({})

  useEffect(() => {
    setStars(getTotalStars())
    const next = {}
    sections.forEach((s) => {
      next[s.category] = getCategoryCount(s.category)
    })
    setCounts(next)
  }, [])

  return (
    <div className="page home">
      <section className="hero">
        <Mascot size={130} />
        <h1 className="hero__title">Let's Read Together!</h1>
        <p className="hero__subtitle">
          Tap a card, listen to Kiwi the parrot say the word, and collect stars
          as you learn to read.
        </p>
        <div className="hero__stars" aria-live="polite">
          <span className="hero__stars-emoji">⭐</span>
          <span>{stars} stars earned</span>
          <span className="hero__car"><CarAvatar size={28} /></span>
        </div>
        <Link to="/progress" className="hero__progress-link">See my full progress →</Link>
      </section>

      <section className="section-grid">
        {sections.map((s) => (
          <Link key={s.to} to={s.to} className={`section-card section-card--${s.accent}`}>
            <div className="section-card__emoji" aria-hidden="true">{s.emoji}</div>
            <h2 className="section-card__title">{s.title}</h2>
            <p className="section-card__blurb">{s.blurb}</p>
            <ProgressSummary
              label="Progress"
              learned={counts[s.category] || 0}
              total={s.total}
              accent={s.accent}
            />
          </Link>
        ))}
      </section>
    </div>
  )
}
