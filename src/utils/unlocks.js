import { getCategoryCount } from './progress'
import { sentences } from '../data/sentences'

const QUIZ_KEY = 'readWithMe.quizPassed.v1'

// The order lessons unlock in. Alphabet is always open; each later
// section unlocks once the quiz for the previous section is passed.
const ORDER = ['alphabet', 'phonics', 'words', 'sentences']

// The car Kiwi's car-shaped progress marker upgrades through as the
// child advances — used on the Progress page.
export const CARS = [
  { emoji: '🛵', label: 'Scooter' },
  { emoji: '🚗', label: 'Car' },
  { emoji: '🚙', label: 'SUV' },
  { emoji: '🏎️', label: 'Race Car' },
  { emoji: '🚀', label: 'Rocket' },
]

function getQuizState() {
  try {
    const raw = localStorage.getItem(QUIZ_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (e) {
    return {}
  }
}

function saveQuizState(state) {
  try {
    localStorage.setItem(QUIZ_KEY, JSON.stringify(state))
  } catch (e) {
    console.warn('Could not save quiz progress', e)
  }
}

export function hasPassedQuiz(category) {
  return Boolean(getQuizState()[category])
}

export function setQuizPassed(category) {
  const state = getQuizState()
  state[category] = true
  saveQuizState(state)
}

export function isSectionUnlocked(category) {
  const idx = ORDER.indexOf(category)
  if (idx <= 0) return true // alphabet, or unknown category, always open
  const previous = ORDER[idx - 1]
  return hasPassedQuiz(previous)
}

export function nextCategory(category) {
  const idx = ORDER.indexOf(category)
  if (idx === -1 || idx === ORDER.length - 1) return null
  return ORDER[idx + 1]
}

export function getCarLevel() {
  let level = 0
  if (hasPassedQuiz('alphabet')) level = 1
  if (hasPassedQuiz('phonics')) level = 2
  if (hasPassedQuiz('words')) level = 3
  if (hasPassedQuiz('words') && getCategoryCount('sentences') >= sentences.length) level = 4
  return level
}

export function getCurrentCar() {
  const level = getCarLevel()
  return CARS[Math.min(level, CARS.length - 1)]
}

export function resetUnlocks() {
  saveQuizState({})
}
