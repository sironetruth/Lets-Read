const STORAGE_KEY = 'readWithMe.progress.v1'

const emptyState = {
  alphabet: {},
  phonics: {},
  words: {},
  sentences: {},
}

export function getProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...emptyState }
    const parsed = JSON.parse(raw)
    return { ...emptyState, ...parsed }
  } catch (e) {
    console.warn('Could not read progress from localStorage', e)
    return { ...emptyState }
  }
}

function saveProgress(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.warn('Could not save progress to localStorage', e)
  }
}

export function isComplete(category, id) {
  const state = getProgress()
  return Boolean(state[category] && state[category][id])
}

export function toggleComplete(category, id) {
  const state = getProgress()
  const categoryState = { ...(state[category] || {}) }
  categoryState[id] = !categoryState[id]
  const next = { ...state, [category]: categoryState }
  saveProgress(next)
  return next
}

export function setComplete(category, id, value = true) {
  const state = getProgress()
  const categoryState = { ...(state[category] || {}) }
  categoryState[id] = value
  const next = { ...state, [category]: categoryState }
  saveProgress(next)
  return next
}

export function getCategoryCount(category) {
  const state = getProgress()
  const categoryState = state[category] || {}
  return Object.values(categoryState).filter(Boolean).length
}

export function getCountByPrefix(category, prefix) {
  const state = getProgress()
  const categoryState = state[category] || {}
  return Object.entries(categoryState).filter(([key, val]) => val && key.startsWith(prefix)).length
}

export function getTotalStars() {
  const state = getProgress()
  return Object.values(state).reduce((sum, cat) => {
    return sum + Object.values(cat).filter(Boolean).length
  }, 0)
}

export function resetProgress() {
  saveProgress({ ...emptyState })
  return { ...emptyState }
}