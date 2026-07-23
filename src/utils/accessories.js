import { hasPassedQuiz } from './unlocks'

const ACCESSORY_KEY = 'readWithMe.accessory.v1'

// Each accessory unlocks by passing the quiz for a given section (null =
// always available). Rendered as a small emoji overlay on the mascot.
export const ACCESSORIES = [
  { id: 'none', emoji: null, label: 'No accessory', unlockedBy: null },
  { id: 'hat', emoji: '🎩', label: 'Top Hat', unlockedBy: 'alphabet' },
  { id: 'glasses', emoji: '🕶️', label: 'Cool Glasses', unlockedBy: 'phonics' },
  { id: 'bow', emoji: '🎀', label: 'Bow Tie', unlockedBy: 'words' },
  { id: 'crown', emoji: '👑', label: 'Crown', unlockedBy: 'sentences' },
]

export function isAccessoryUnlocked(accessory) {
  if (!accessory.unlockedBy) return true
  return hasPassedQuiz(accessory.unlockedBy)
}

export function getEquippedAccessoryId() {
  try {
    return localStorage.getItem(ACCESSORY_KEY) || 'none'
  } catch (e) {
    return 'none'
  }
}

export function setEquippedAccessoryId(id) {
  try {
    localStorage.setItem(ACCESSORY_KEY, id)
  } catch (e) {
    console.warn('Could not save accessory choice', e)
  }
}

export function getEquippedAccessoryEmoji() {
  const id = getEquippedAccessoryId()
  const found = ACCESSORIES.find((a) => a.id === id)
  return found?.emoji || null
}