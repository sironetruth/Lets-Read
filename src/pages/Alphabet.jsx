import { useEffect, useState, useCallback } from 'react'
import { alphabet } from '../data/alphabet'
import { isComplete, toggleComplete, setComplete } from '../utils/progress'
import { hasPassedQuiz } from '../utils/unlocks'
import { speak, speakAsCharacter } from '../utils/speech'
import SpeakButton from '../components/SpeakButton'
import Mascot from '../components/Mascot'
import FinalQuiz from '../components/FinalQuiz'

const accents = ['coral', 'sky', 'grass', 'sun', 'grape']

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// Turns a word like "Banana" into a sequence of slots. EVERY letter in the
// word is a blank the child fills in by tapping letter tiles, in order,
// left to right — including the first letter, which matches the alphabet
// card they just tapped. Nothing is pre-filled for them.
function buildWordSlots(word) {
  const chars = word.split('')
  return chars.map((ch) => {
    if (!/[a-zA-Z]/.test(ch)) {
      return { type: 'fixed', display: ch }
    }
    return { type: 'blank', display: ch, letter: ch.toLowerCase(), filled: false }
  })
}

// Shared "spell the word" game mechanics, reused by both the sequential
// single-letter view and the free-mode replay modal so the tile-matching
// logic only lives in one place.
function useWordGame() {
  const [slots, setSlots] = useState([])
  const [tiles, setTiles] = useState([])
  const [wrongTileId, setWrongTileId] = useState(null)
  const [gameComplete, setGameComplete] = useState(false)

  const buildGame = useCallback((word) => {
    const built = buildWordSlots(word)
    setSlots(built)
    const blankTiles = built
      .filter((s) => s.type === 'blank')
      .map((s, i) => ({ id: `${s.letter}-${i}`, letter: s.letter, used: false }))
    setTiles(shuffle(blankTiles))
    setWrongTileId(null)
    setGameComplete(false)
  }, [])

  // Reads `slots`/`gameComplete` directly rather than via a setState
  // updater function, and fires `speak()` as a normal side effect in the
  // handler body (not inside a state updater, which React can invoke more
  // than once and will drop/duplicate side effects placed inside it).
  const handleTileTap = (tile, onWordComplete) => {
    if (tile.used || gameComplete) return
    const nextBlankIndex = slots.findIndex((s) => s.type === 'blank' && !s.filled)
    if (nextBlankIndex === -1) return

    if (slots[nextBlankIndex].letter === tile.letter) {
      const updatedSlots = slots.map((s, i) => (i === nextBlankIndex ? { ...s, filled: true } : s))
      setSlots(updatedSlots)
      setTiles((prev) => prev.map((t) => (t.id === tile.id ? { ...t, used: true } : t)))
      setWrongTileId(null)
      // Say the letter they just tapped, e.g. tapping "p" in "apple" says "P"
      speak(tile.letter.toUpperCase())

      const stillBlank = updatedSlots.some((s) => s.type === 'blank' && !s.filled)
      if (!stillBlank) {
        setGameComplete(true)
        // Small pause so the letter-name audio isn't cut off by the
        // "you spelled it!" celebration that follows.
        if (onWordComplete) setTimeout(onWordComplete, 700)
      }
    } else {
      setWrongTileId(tile.id)
      setTimeout(() => setWrongTileId(null), 500)
    }
  }

  return { slots, tiles, wrongTileId, gameComplete, buildGame, handleTileTap }
}

// Runs `callback` once Kiwi finishes saying `text` — rather than guessing a
// fixed delay — so the next letter never appears while she's still talking.
// `fallbackMs` is a safety net in case speech fails to fire onEnd at all.
function speakThenWait(text, fallbackMs, callback) {
  let done = false
  const finish = () => {
    if (done) return
    done = true
    callback()
  }
  try {
    speakAsCharacter(text, { onEnd: finish })
  } catch (e) {
    finish()
  }
  setTimeout(finish, fallbackMs)
}

export default function Alphabet() {
  const [progressMap, setProgressMap] = useState({})
  const [ready, setReady] = useState(false)

  // 'sequential' = teach one letter at a time in order (default for a
  // fresh or in-progress learner). 'free' = full grid, any letter, any
  // order — unlocked once every letter has been learned at least once.
  const [mode, setMode] = useState('sequential')
  const [currentLetterId, setCurrentLetterId] = useState(null)

  // Free-mode grid tap-to-review modal
  const [reviewLetter, setReviewLetter] = useState(null)
  const [practicing, setPracticing] = useState(false)

  const seqGame = useWordGame()
  const reviewGame = useWordGame()

  // Load saved progress and decide where to resume: first not-yet-learned
  // letter in sequential mode, or free mode if everything's done already.
  useEffect(() => {
    const map = {}
    alphabet.forEach((letter) => {
      map[letter.id] = isComplete('alphabet', letter.id)
    })
    setProgressMap(map)

    const firstUnlearned = alphabet.find((l) => !map[l.id])
    if (firstUnlearned) {
      setMode('sequential')
      setCurrentLetterId(firstUnlearned.id)
    } else {
      setMode('free')
    }
    setReady(true)
  }, [])

  // Build/rebuild the spelling game whenever the sequential letter changes
  useEffect(() => {
    if (mode !== 'sequential' || !currentLetterId) return
    const letter = alphabet.find((l) => l.id === currentLetterId)
    if (!letter) return
    seqGame.buildGame(letter.word)
    speak(`That is letter ${letter.id}.`, {
      onEnd: () => speakAsCharacter(`This is letter ${letter.id}! Let's spell ${letter.word}!`),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLetterId, mode])

  // Friendly hello from Kiwi on load
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        speakAsCharacter("Let's learn the letters!")
      } catch (e) {
        // ignore — autoplay may be blocked, manual button still works
      }
    }, 400)
    return () => clearTimeout(t)
  }, [])

  const learnedCount = Object.values(progressMap).filter(Boolean).length

  // Move forward to the next letter after the current one is mastered,
  // skipping any that (from older progress) were already learned. If
  // there's nothing left, unlock free mode instead.
  const advanceAfterMastery = (letterId) => {
    const idx = alphabet.findIndex((l) => l.id === letterId)
    let nextIdx = idx + 1
    while (nextIdx < alphabet.length && progressMap[alphabet[nextIdx].id]) {
      nextIdx++
    }
    if (nextIdx >= alphabet.length) {
      speakThenWait('Hooray! You learned the whole alphabet!', 4000, () => {
        setTimeout(() => setMode('free'), 700)
      })
    } else {
      // A short breather after Kiwi finishes talking before the next
      // letter appears, so it doesn't feel like it's rushing along.
      setTimeout(() => setCurrentLetterId(alphabet[nextIdx].id), 900)
    }
  }

  const markCurrentLetterLearned = (letterId) => {
    setComplete('alphabet', letterId, true)
    setProgressMap((prev) => ({ ...prev, [letterId]: true }))
  }

  const handleSequentialMastery = () => {
    const letter = alphabet.find((l) => l.id === currentLetterId)
    if (!letter) return
    if (!progressMap[letter.id]) {
      markCurrentLetterLearned(letter.id)
    }
    // Wait for "Yay! You spelled ___!" to finish before moving on.
    speakThenWait(`Yay! You spelled ${letter.word}!`, 4000, () => {
      advanceAfterMastery(letter.id)
    })
  }

  // "I already know this one" skip button — marks it learned and advances
  // without requiring the spelling game.
  const handleSkipToKnown = () => {
    const letter = alphabet.find((l) => l.id === currentLetterId)
    if (!letter) return
    if (!progressMap[letter.id]) {
      markCurrentLetterLearned(letter.id)
    }
    speakThenWait(`Great job, you already know ${letter.id}!`, 3500, () => {
      advanceAfterMastery(letter.id)
    })
  }

  // Free-mode grid: tap a letter to reopen it and replay its spelling game
  const handleOpenLetter = (letter) => {
    setReviewLetter(letter)
    reviewGame.buildGame(letter.word)
    speak(`That is letter ${letter.id}.`, {
      onEnd: () => speakAsCharacter(`This is letter ${letter.id}! Let's spell ${letter.word}!`),
    })
  }

  const handleToggle = (id) => {
    toggleComplete('alphabet', id)
    setProgressMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  if (!ready) return null

  const currentIndex = currentLetterId ? alphabet.findIndex((l) => l.id === currentLetterId) : -1
  const currentLetter = currentIndex >= 0 ? alphabet[currentIndex] : null

  return (
    <div className="page page--alphabet">
      <div className="mascot-banner">
        <Mascot size={56} mood="excited" />
        <div className="mascot-banner__bubble">
          <p>Let's learn the letters!</p>
          <button
            type="button"
            className="mascot-banner__play"
            onClick={() => speakAsCharacter("Let's learn the letters!")}
            aria-label="Hear Kiwi"
          >
            🔊
          </button>
        </div>
      </div>

      <header className="page-header">
        <h1>Alphabet Lessons</h1>
        <p>
          {mode === 'sequential'
            ? "Help Kiwi spell the word, and we'll move to the next letter together!"
            : 'Tap a letter to hear it, then help Kiwi spell the word!'}
        </p>
        <p className="page-header__count">{learnedCount} of {alphabet.length} letters learned</p>
      </header>

      {mode === 'sequential' && currentLetter && (
        <>
          <div className="letter-progress-strip" aria-hidden="true">
            {alphabet.map((letter, i) => (
              <span
                key={letter.id}
                className={
                  'letter-progress-dot' +
                  (progressMap[letter.id] ? ' letter-progress-dot--done' : '') +
                  (letter.id === currentLetterId ? ' letter-progress-dot--current' : '')
                }
              />
            ))}
          </div>

          {learnedCount > 0 && (
            <div className="learned-review-strip">
              <p className="learned-review-strip__label">⭐ Tap a learned letter to redo it:</p>
              <div className="learned-review-strip__chips">
                {alphabet
                  .filter((letter) => progressMap[letter.id])
                  .map((letter) => (
                    <button
                      key={letter.id}
                      type="button"
                      className="learned-review-chip"
                      onClick={() => handleOpenLetter(letter)}
                    >
                      {letter.id}
                    </button>
                  ))}
              </div>
            </div>
          )}

          <div className="modal modal--inline">
            <div className="modal__letter">
              {currentLetter.id}
              {currentLetter.id.toLowerCase()}
            </div>
            <div className="modal__emoji">{currentLetter.emoji}</div>
            <div className="modal__actions">
              <SpeakButton
                text={`${currentLetter.id}, like in ${currentLetter.word}`}
                label="Say letter and word"
                size="lg"
              />
              <button type="button" className="mark-btn mark-btn--lg" onClick={handleSkipToKnown}>
                I already know this ⏭️
              </button>
            </div>

            <div className="word-builder">
              <p className="word-builder__prompt">🔤 Let's spell it!</p>
              <div className="word-builder__slots">
                {seqGame.slots.map((s, i) => {
                  if (s.type === 'fixed') {
                    return (
                      <span key={i} className="word-slot word-slot--fixed">
                        {s.display}
                      </span>
                    )
                  }
                  if (s.filled) {
                    return (
                      <span key={i} className="word-slot word-slot--filled">
                        {s.display}
                      </span>
                    )
                  }
                  return (
                    <span key={i} className="word-slot word-slot--ghost">
                      {s.display}
                    </span>
                  )
                })}
              </div>

              {!seqGame.gameComplete ? (
                <div className="word-builder__tiles">
                  {seqGame.tiles.filter((t) => !t.used).map((t) => (
                    <button
                      key={t.id}
                      className={`word-tile ${seqGame.wrongTileId === t.id ? 'word-tile--shake' : ''}`}
                      onClick={() => seqGame.handleTileTap(t, handleSequentialMastery)}
                    >
                      {t.letter}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="word-builder__success">
                  <span aria-hidden="true">🎉</span> Yay! You spelled {currentLetter.word}!
                  <p className="word-builder__next-hint">Getting the next letter ready…</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {mode === 'free' && (
        <div className="letter-grid">
          {alphabet.map((letter, i) => {
            const accent = accents[i % accents.length]
            const complete = Boolean(progressMap[letter.id])
            return (
              <button
                key={letter.id}
                className={`letter-card letter-card--${accent} ${complete ? 'letter-card--complete' : ''}`}
                onClick={() => handleOpenLetter(letter)}
              >
                {complete && <span className="letter-card__star">⭐</span>}
                <span className="letter-card__letter">{letter.id}</span>
                <span className="letter-card__emoji">{letter.emoji}</span>
              </button>
            )
          })}
        </div>
      )}

      {reviewLetter && (
            <div className="modal-overlay" onClick={() => setReviewLetter(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal__close" onClick={() => setReviewLetter(null)} aria-label="Close">
                  ✕
                </button>
                <div className="modal__letter">
                  {reviewLetter.id}
                  {reviewLetter.id.toLowerCase()}
                </div>
                <div className="modal__emoji">{reviewLetter.emoji}</div>
                <div className="modal__actions">
                  <SpeakButton
                    text={`${reviewLetter.id}, like in ${reviewLetter.word}`}
                    label="Say letter and word"
                    size="lg"
                  />
                  <button type="button" className="mark-btn mark-btn--lg" onClick={() => handleToggle(reviewLetter.id)}>
                    {progressMap[reviewLetter.id] ? 'Learned ✓' : 'Mark as learned'}
                  </button>
                </div>

                <div className="word-builder">
                  <p className="word-builder__prompt">🔤 Let's spell it!</p>
                  <div className="word-builder__slots">
                    {reviewGame.slots.map((s, i) => {
                      if (s.type === 'fixed') {
                        return (
                          <span key={i} className="word-slot word-slot--fixed">
                            {s.display}
                          </span>
                        )
                      }
                      if (s.filled) {
                        return (
                          <span key={i} className="word-slot word-slot--filled">
                            {s.display}
                          </span>
                        )
                      }
                      return (
                        <span key={i} className="word-slot word-slot--ghost">
                          {s.display}
                        </span>
                      )
                    })}
                  </div>

                  {!reviewGame.gameComplete ? (
                    <div className="word-builder__tiles">
                      {reviewGame.tiles.filter((t) => !t.used).map((t) => (
                        <button
                          key={t.id}
                          className={`word-tile ${reviewGame.wrongTileId === t.id ? 'word-tile--shake' : ''}`}
                          onClick={() => reviewGame.handleTileTap(t)}
                        >
                          {t.letter}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="word-builder__success">
                      <span aria-hidden="true">🎉</span> Yay! You spelled {reviewLetter.word}!
                      <button
                        type="button"
                        className="practice-toggle"
                        onClick={() => reviewGame.buildGame(reviewLetter.word)}
                      >
                        🔁 Spell it again
                      </button>
                    </div>
                  )}
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
