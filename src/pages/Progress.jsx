import { useEffect, useState } from 'react'
import { getCategoryCount, getTotalStars } from '../utils/progress'
import { hasPassedQuiz, isSectionUnlocked, CARS, getCarLevel } from '../utils/unlocks'
import { BADGES } from '../utils/badges'
import { alphabet } from '../data/alphabet'
import { phonicsGroups } from '../data/phonics'
import { wordCategories } from '../data/words'
import { sentences } from '../data/sentences'

const wordsTotal = wordCategories.reduce((sum, c) => sum + c.items.length, 0)

const stations = [
  { category: 'alphabet', label: 'Alphabet', emoji: '🔤', total: alphabet.length },
  { category: 'phonics', label: 'Phonics', emoji: '🎵', total: phonicsGroups.length },
  { category: 'words', label: 'Words', emoji: '🧩', total: wordsTotal },
  { category: 'sentences', label: 'Sentences', emoji: '📖', total: sentences.length },
]

export default function Progress() {
  const [counts, setCounts] = useState({})
  const [stars, setStars] = useState(0)

  useEffect(() => {
    const next = {}
    stations.forEach((s) => { next[s.category] = getCategoryCount(s.category) })
    setCounts(next)
    setStars(getTotalStars())
  }, [])

  const carLevel = getCarLevel()

  return (
    <div className="page">
      <header className="page-header">
        <h1>My Progress</h1>
        <p>Every quiz you pass unlocks the next adventure and a new ride!</p>
        <p className="page-header__count">⭐ {stars} stars earned</p>
      </header>

      <div className="road">
        {stations.map((s, i) => {
          const unlocked = isSectionUnlocked(s.category)
          const passed = hasPassedQuiz(s.category)
          const showCarHere = carLevel === i || (i === stations.length - 1 && carLevel >= stations.length - 1)
          return (
            <div key={s.category} className="road__stop">
              {showCarHere && (
                <div className="road__car" role="img" aria-label="Your current ride">
                  {CARS[Math.min(carLevel, CARS.length - 1)].emoji}
                </div>
              )}
              <div className={`road__marker ${passed ? 'road__marker--passed' : unlocked ? 'road__marker--unlocked' : 'road__marker--locked'}`}>
                {passed ? '⭐' : unlocked ? s.emoji : '🔒'}
              </div>
              <div className="road__label">{s.label}</div>
              <div className="road__count">{counts[s.category] || 0}/{s.total}</div>
              {i < stations.length - 1 && <div className="road__connector" />}
            </div>
          )
        })}
      </div>

      <div className="progress-detail">
        {stations.map((s) => {
          const unlocked = isSectionUnlocked(s.category)
          const passed = hasPassedQuiz(s.category)
          const learned = counts[s.category] || 0
          const pct = s.total > 0 ? Math.round((learned / s.total) * 100) : 0
          return (
            <div key={s.category} className="progress-detail__row">
              <span className="progress-detail__emoji">{s.emoji}</span>
              <span className="progress-detail__label">{s.label}</span>
              <div className="progress-detail__track">
                <div className="progress-detail__fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="progress-detail__status">
                {passed ? 'Quiz passed ⭐' : unlocked ? `${pct}%` : 'Locked'}
              </span>
            </div>
          )
        })}
      </div>

      <section className="badge-wall">
        <h2 className="badge-wall__title">🎖️ Badge Wall</h2>
        <div className="badge-wall__grid">
          {BADGES.map((badge) => {
            const earned = badge.check()
            return (
              <div key={badge.id} className={`badge-card ${earned ? 'badge-card--earned' : 'badge-card--locked'}`}>
                <div className="badge-card__emoji">{earned ? badge.emoji : '🔒'}</div>
                <div className="badge-card__label">{badge.label}</div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
