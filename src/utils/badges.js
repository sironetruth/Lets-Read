import { getCategoryCount, getCountByPrefix, getTotalStars } from './progress'
import { hasPassedQuiz } from './unlocks'
import { alphabet } from '../data/alphabet'
import { phonicsGroups } from '../data/phonics'
import { sentences } from '../data/sentences'

export const BADGES = [
  { id: 'first-star', emoji: '⭐', label: 'First Star', check: () => getTotalStars() >= 1 },
  { id: 'letter-master', emoji: '🔤', label: 'Letter Master', check: () => hasPassedQuiz('alphabet') },
  { id: 'perfect-alphabet', emoji: '🏆', label: 'All 26 Letters', check: () => getCategoryCount('alphabet') >= alphabet.length },
  { id: 'sound-explorer', emoji: '🎵', label: 'Sound Explorer', check: () => hasPassedQuiz('phonics') },
  { id: 'all-sounds', emoji: '👂', label: 'All Sounds Practiced', check: () => getCategoryCount('phonics') >= phonicsGroups.length },
  { id: 'word-wizard', emoji: '🧩', label: 'Word Wizard', check: () => hasPassedQuiz('words') },
  { id: 'century-club', emoji: '💯', label: 'Century Club', check: () => getCountByPrefix('words', 'numbers-') >= 100 },
  { id: 'story-reader', emoji: '📖', label: 'Story Reader', check: () => getCategoryCount('sentences') >= sentences.length },
]

export function getEarnedBadges() {
  return BADGES.filter((b) => b.check())
}