import { useEffect, useState } from 'react'
import { sentences } from '../data/sentences'
import { isComplete, toggleComplete } from '../utils/progress'
import { isSectionUnlocked } from '../utils/unlocks'
import SpeakButton from '../components/SpeakButton'
import LockedNotice from '../components/LockedNotice'
import { speak } from '../utils/speech'

const accents = ['grape', 'coral', 'sky', 'grass', 'sun']
const levelLabels = { 1: 'Starter', 2: 'Growing Reader', 3: 'Big Kid' }

export default function Sentences() {
  const [progressMap, setProgressMap] = useState({})
  const unlocked = isSectionUnlocked('sentences')

  useEffect(() => {
    const map = {}
    sentences.forEach((s) => {
      map[s.id] = isComplete('sentences', s.id)
    })
    setProgressMap(map)
  }, [])

  const handleToggle = (id) => {
    toggleComplete('sentences', id)
    setProgressMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const learnedCount = Object.values(progressMap).filter(Boolean).length

  if (!unlocked) {
    return (
      <div className="page">
        <LockedNotice requires="words" />
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Beginner Sentences</h1>
        <p>Listen to the whole sentence, or tap a single word to hear it alone.</p>
        <p className="page-header__count">{learnedCount} of {sentences.length} sentences read</p>
      </header>

      <div className="sentence-list">
        {sentences.map((s, i) => {
          const accent = accents[i % accents.length]
          const complete = Boolean(progressMap[s.id])
          const words = s.text.replace('.', '').split(' ')
          return (
            <div key={s.id} className={`sentence-card sentence-card--${accent} ${complete ? 'sentence-card--complete' : ''}`}>
              <div className="sentence-card__top">
                <span className="sentence-card__emoji">{s.emoji}</span>
                <span className="sentence-card__level">{levelLabels[s.level]}</span>
                {complete && <span className="sentence-card__star">⭐</span>}
              </div>
              <div className="sentence-card__words">
                {words.map((word, idx) => (
                  <button
                    key={idx}
                    className="sentence-word"
                    onClick={() => speak(word, { rate: 0.8 })}
                  >
                    {word}
                  </button>
                ))}
                <span className="sentence-card__period">.</span>
              </div>
              <div className="sentence-card__actions">
                <SpeakButton text={s.text} label="Read whole sentence" rate={0.78} />
                <button
                  type="button"
                  className="mark-btn"
                  onClick={() => handleToggle(s.id)}
                >
                  {complete ? 'Read ✓' : 'Mark as read'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
