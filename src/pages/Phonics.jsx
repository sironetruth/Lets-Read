import { useEffect, useState } from 'react'
import { phonicsGroups } from '../data/phonics'
import { isComplete, toggleComplete } from '../utils/progress'
import { isSectionUnlocked, hasPassedQuiz } from '../utils/unlocks'
import SpeakButton from '../components/SpeakButton'
import FinalQuiz from '../components/FinalQuiz'
import LockedNotice from '../components/LockedNotice'

const accents = ['sky', 'coral', 'grass', 'sun', 'grape']

export default function Phonics() {
  const [progressMap, setProgressMap] = useState({})
  const [practicing, setPracticing] = useState(false)
  const unlocked = isSectionUnlocked('phonics')

  useEffect(() => {
    const map = {}
    phonicsGroups.forEach((g) => {
      map[g.id] = isComplete('phonics', g.id)
    })
    setProgressMap(map)
  }, [])

  const handleToggle = (id) => {
    toggleComplete('phonics', id)
    setProgressMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const learnedCount = Object.values(progressMap).filter(Boolean).length

  if (!unlocked) {
    return (
      <div className="page page--phonics">
        <LockedNotice requires="alphabet" />
      </div>
    )
  }

  return (
    <div className="page page--phonics">
      <header className="page-header">
        <h1>Phonics Practice</h1>
        <p>Listen to each sound, then hear the words that use it.</p>
        <p className="page-header__count">{learnedCount} of {phonicsGroups.length} sounds practiced</p>
      </header>

      <div className="phonics-list">
        {phonicsGroups.map((group, i) => {
          const accent = accents[i % accents.length]
          const complete = Boolean(progressMap[group.id])
          return (
            <div key={group.id} className={`phonics-card phonics-card--${accent} ${complete ? 'phonics-card--complete' : ''}`}>
              <div className="phonics-card__header">
                <div className="phonics-card__emoji">{group.emoji}</div>
                <div>
                  <h2 className="phonics-card__title">{group.title}</h2>
                  <SpeakButton text={group.speakSound || group.sound} label="Hear the sound" />
                </div>
                {complete && <span className="phonics-card__star">⭐</span>}
              </div>
              <div className="phonics-card__words">
                {group.words.map((w) => (
                  <div key={w.text} className="phonics-word">
                    <span className="phonics-word__emoji">{w.emoji}</span>
                    <span className="phonics-word__text">{w.text}</span>
                    <SpeakButton text={w.text} size="sm" />
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="mark-btn"
                onClick={() => handleToggle(group.id)}
              >
                {complete ? 'Practiced ✓' : 'Mark as practiced'}
              </button>
            </div>
          )
        })}
      </div>

      <section className="quiz-section">
        {hasPassedQuiz('phonics') ? (
          <div className="quiz-passed-wrap">
            <div className="quiz-passed-banner">🎉 You already passed the Phonics quiz and unlocked Simple Words!</div>
            <button type="button" className="practice-toggle" onClick={() => setPracticing((p) => !p)}>
              {practicing ? 'Hide practice round' : '🔁 Practice again for fun'}
            </button>
            {practicing && <FinalQuiz category="phonics" title="Phonics Practice" practiceMode />}
          </div>
        ) : learnedCount >= Math.ceil(phonicsGroups.length * 0.7) ? (
          <FinalQuiz category="phonics" title="Phonics Quiz" />
        ) : (
          <p className="quiz-locked-hint">
            Practice at least {Math.ceil(phonicsGroups.length * 0.7)} sounds to unlock the Phonics quiz.
          </p>
        )}
      </section>
    </div>
  )
}
