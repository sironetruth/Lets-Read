import { useEffect, useState } from 'react'
import { alphabet } from '../data/alphabet'
import { isComplete, toggleComplete } from '../utils/progress'
import { hasPassedQuiz } from '../utils/unlocks'
import SpeakButton from '../components/SpeakButton'
import FinalQuiz from '../components/FinalQuiz'

const accents = ['coral', 'sky', 'grass', 'sun', 'grape']

export default function Alphabet() {
  const [progressMap, setProgressMap] = useState({})
  const [active, setActive] = useState(null)
  const [practicing, setPracticing] = useState(false)

  useEffect(() => {
    const map = {}
    alphabet.forEach((letter) => {
      map[letter.id] = isComplete('alphabet', letter.id)
    })
    setProgressMap(map)
  }, [])

  const handleToggle = (id) => {
    toggleComplete('alphabet', id)
    setProgressMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const learnedCount = Object.values(progressMap).filter(Boolean).length

  return (
    <div className="page">
      <header className="page-header">
        <h1>Alphabet Lessons</h1>
        <p>Tap a letter to see it up close, hear it, and mark it as learned.</p>
        <p className="page-header__count">{learnedCount} of {alphabet.length} letters learned</p>
      </header>

      <div className="letter-grid">
        {alphabet.map((letter, i) => {
          const accent = accents[i % accents.length]
          const complete = Boolean(progressMap[letter.id])
          return (
            <button
              key={letter.id}
              className={`letter-card letter-card--${accent} ${complete ? 'letter-card--complete' : ''}`}
              onClick={() => setActive(letter)}
            >
              {complete && <span className="letter-card__star">⭐</span>}
              <span className="letter-card__letter">{letter.id}</span>
              <span className="letter-card__emoji">{letter.emoji}</span>
            </button>
          )
        })}
      </div>

      {active && (
        <div className="modal-overlay" onClick={() => setActive(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={() => setActive(null)} aria-label="Close">✕</button>
            <div className="modal__letter">{active.id}{active.id.toLowerCase()}</div>
            <div className="modal__emoji">{active.emoji}</div>
            <div className="modal__word">{active.word}</div>
            <div className="modal__actions">
              <SpeakButton text={`${active.id}, like in ${active.word}`} label="Say letter and word" size="lg" />
              <button
                type="button"
                className="mark-btn mark-btn--lg"
                onClick={() => handleToggle(active.id)}
              >
                {progressMap[active.id] ? 'Learned ✓' : 'Mark as learned'}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="quiz-section">
        {hasPassedQuiz('alphabet') ? (
          <div className="quiz-passed-wrap">
            <div className="quiz-passed-banner">🎉 You already passed the Alphabet quiz and unlocked Phonics!</div>
            <button type="button" className="practice-toggle" onClick={() => setPracticing((p) => !p)}>
              {practicing ? 'Hide practice round' : '🔁 Practice again for fun'}
            </button>
            {practicing && <FinalQuiz category="alphabet" title="Alphabet Practice" practiceMode />}
          </div>
        ) : learnedCount >= Math.ceil(alphabet.length * 0.7) ? (
          <FinalQuiz category="alphabet" title="Alphabet Quiz" />
        ) : (
          <p className="quiz-locked-hint">
            Learn at least {Math.ceil(alphabet.length * 0.7)} letters to unlock the Alphabet quiz.
          </p>
        )}
      </section>
    </div>
  )
}
