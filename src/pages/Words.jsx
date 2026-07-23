import { useEffect, useState } from 'react'
import { wordCategories } from '../data/words'
import { isComplete, toggleComplete, getCategoryCount } from '../utils/progress'
import { isSectionUnlocked, hasPassedQuiz } from '../utils/unlocks'
import LessonCard from '../components/LessonCard'
import FinalQuiz from '../components/FinalQuiz'
import LockedNotice from '../components/LockedNotice'

const wordsTotal = wordCategories.reduce((sum, c) => sum + c.items.length, 0)
const QUIZ_THRESHOLD = 20

export default function Words() {
  const [activeCategory, setActiveCategory] = useState(wordCategories[0].id)
  const [progressMap, setProgressMap] = useState({})
  const [practicing, setPracticing] = useState(false)
  const unlocked = isSectionUnlocked('words')

  useEffect(() => {
    const map = {}
    wordCategories.forEach((cat) => {
      cat.items.forEach((item) => {
        map[item.id] = isComplete('words', item.id)
      })
    })
    setProgressMap(map)
  }, [])

  const handleToggle = (id) => {
    toggleComplete('words', id)
    setProgressMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  if (!unlocked) {
    return (
      <div className="page page--words">
        <LockedNotice requires="phonics" />
      </div>
    )
  }

  const currentCategory = wordCategories.find((c) => c.id === activeCategory)
  const learnedInCategory = currentCategory.items.filter((i) => progressMap[i.id]).length
  const totalLearned = getCategoryCount('words')

  return (
    <div className="page page--words">
      <header className="page-header">
        <h1>Simple Words</h1>
        <p>Choose a topic, then tap a card to hear the word out loud.</p>
      </header>

      <div className="category-tabs">
        {wordCategories.map((cat) => (
          <button
            key={cat.id}
            className={`category-tab category-tab--${cat.color} ${activeCategory === cat.id ? 'category-tab--active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.title}
          </button>
        ))}
      </div>

      <p className="page-header__count">
        {learnedInCategory} of {currentCategory.items.length} words learned in {currentCategory.title}
        {' · '}{totalLearned} of {wordsTotal} words overall
      </p>

      <div className="card-grid">
        {currentCategory.items.map((item) => (
          <LessonCard
            key={item.id}
            emoji={item.emoji}
            title={item.text}
            speakText={item.text}
            accent={currentCategory.color}
            complete={Boolean(progressMap[item.id])}
            onToggleComplete={() => handleToggle(item.id)}
          />
        ))}
      </div>

      <section className="quiz-section">
        {hasPassedQuiz('words') ? (
          <div className="quiz-passed-wrap">
            <div className="quiz-passed-banner">🎉 You already passed the Words quiz and unlocked Sentences!</div>
            <button type="button" className="practice-toggle" onClick={() => setPracticing((p) => !p)}>
              {practicing ? 'Hide practice round' : '🔁 Practice again for fun'}
            </button>
            {practicing && <FinalQuiz category="words" title="Words Practice" practiceMode />}
          </div>
        ) : totalLearned >= QUIZ_THRESHOLD ? (
          <FinalQuiz category="words" title="Words Quiz" />
        ) : (
          <p className="quiz-locked-hint">
            Learn at least {QUIZ_THRESHOLD} words (from any topics) to unlock the Words quiz.
          </p>
        )}
      </section>
    </div>
  )
}
