import { useEffect, useMemo, useState } from 'react'
import { buildQuestions } from '../utils/quizzes'
import { setQuizPassed, nextCategory, getCurrentCar } from '../utils/unlocks'
import { speak } from '../utils/speech'
import SpeakButton from './SpeakButton'

const NEXT_LABEL = {
  phonics: 'Phonics',
  words: 'Simple Words',
  sentences: 'Sentences',
}

export default function FinalQuiz({ category, title, practiceMode = false }) {
  const [attempt, setAttempt] = useState(0)
  const questions = useMemo(() => buildQuestions(category, 5), [category, attempt])
  const [index, setIndex] = useState(0)
  const [feedback, setFeedback] = useState('idle') // idle | correct | wrong
  const [wrongCount, setWrongCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const question = questions[index]

  useEffect(() => {
    setFeedback('idle')
    setWrongCount(0)
  }, [index])

  if (!questions.length) return null

  const advance = () => {
    if (index + 1 >= questions.length) {
      if (!practiceMode) setQuizPassed(category)
      setFinished(true)
    } else {
      setIndex((i) => i + 1)
    }
  }

  const startNewRound = () => {
    setAttempt((a) => a + 1)
    setIndex(0)
    setFeedback('idle')
    setFinished(false)
  }

  const handleTap = (optionId) => {
    if (feedback === 'correct') return
    if (optionId === question.correctId) {
      setFeedback('correct')
      setTimeout(advance, 900)
    } else {
      setFeedback('wrong')
      setWrongCount((c) => c + 1)
    }
  }

  if (finished) {
    if (practiceMode) {
      return (
        <div className="quiz-card quiz-card--finished">
          <div className="quiz-card__confetti">🎉</div>
          <h2>Nice practice!</h2>
          <p>You got them all right. Want to try some different questions?</p>
          <button type="button" className="practice-toggle" onClick={startNewRound}>
            🔁 New practice round
          </button>
        </div>
      )
    }
    const car = getCurrentCar()
    const next = nextCategory(category)
    return (
      <div className="quiz-card quiz-card--finished">
        <div className="quiz-card__confetti">🎉</div>
        <h2>You did it!</h2>
        <div className="quiz-card__car">{car.emoji}</div>
        <p>You unlocked a new ride: <strong>{car.label}</strong>!</p>
        {next && (
          <p className="quiz-card__unlock-msg">
            {NEXT_LABEL[next]} is now unlocked. Keep going!
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="quiz-card">
      <h2 className="quiz-card__title">{title}</h2>
      <p className="quiz-card__progress">Question {index + 1} of {questions.length}</p>

      {question.promptEmoji && (
        <div className="quiz-card__prompt-emoji" aria-hidden="true">{question.promptEmoji}</div>
      )}
      <p className="quiz-card__prompt">{question.prompt}</p>

      <div className="quiz-card__listen">
        <SpeakButton text={question.speakText} label="Hear it again" size="lg" />
      </div>

      <div className="quiz-card__options">
        {question.options.map((opt) => {
          const showHint = wrongCount >= 2 && opt.id === question.correctId && feedback !== 'correct'
          return (
            <button
              key={opt.id}
              className={`quiz-option ${feedback === 'correct' && opt.id === question.correctId ? 'quiz-option--correct' : ''} ${showHint ? 'quiz-option--hint' : ''}`}
              onClick={() => handleTap(opt.id)}
            >
              {opt.emoji && <span className="quiz-option__emoji">{opt.emoji}</span>}
              <span className={`quiz-option__label ${!opt.emoji ? 'quiz-option__label--big' : ''}`}>
                {opt.label}
              </span>
            </button>
          )
        })}
      </div>

      {feedback === 'wrong' && (
        <div className="quiz-feedback quiz-feedback--wrong">
          {wrongCount >= 2 ? '💡 Here\'s a hint — look for the glowing one!' : 'Not quite — try again!'}{' '}
          <button onClick={() => speak(question.speakText)}>🔊 Hear it</button>
        </div>
      )}
      {feedback === 'correct' && (
        <div className="quiz-feedback quiz-feedback--correct">Yes! Great job! ⭐</div>
      )}
    </div>
  )
}
