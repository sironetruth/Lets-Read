import { alphabet } from '../data/alphabet'
import { phonicsGroups } from '../data/phonics'
import { wordCategories } from '../data/words'

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// Alphabet quiz: show a picture, say its word out loud, and ask which
// letter it starts with. This is the classic "letter of the picture"
// matching game toddlers already know from picture-alphabet books.
function buildAlphabetQuestions(count) {
  const chosen = shuffle(alphabet).slice(0, count)
  return chosen.map((letter) => {
    const distractors = shuffle(alphabet.filter((a) => a.id !== letter.id)).slice(0, 2)
    const options = shuffle([letter, ...distractors]).map((o) => ({
      id: o.id, label: o.id,
    }))
    return {
      correctId: letter.id,
      promptEmoji: letter.emoji,
      prompt: 'Which letter does this picture start with?',
      speakText: letter.word,
      options,
    }
  })
}

// Phonics quiz: show the picture for a word, say the word, and ask which
// sound it starts with — matching the picture/word to its sound group.
function buildPhonicsQuestions(count) {
  const groups = shuffle(phonicsGroups).slice(0, Math.min(count, phonicsGroups.length))
  return groups.map((group) => {
    const word = group.words[Math.floor(Math.random() * group.words.length)]
    const distractors = shuffle(phonicsGroups.filter((g) => g.id !== group.id)).slice(0, 2)
    const options = shuffle([group, ...distractors]).map((g) => ({
      id: g.id, label: g.speakSound, emoji: g.emoji,
    }))
    return {
      correctId: group.id,
      promptEmoji: word.emoji,
      prompt: 'Which sound does this word start with?',
      speakText: word.text,
      options,
    }
  })
}

// Words quiz: say a word out loud, tap the matching picture + word.
function buildWordsQuestions(count) {
  const allItems = wordCategories.flatMap((cat) => cat.items.map((i) => ({ ...i })))
  const chosen = shuffle(allItems).slice(0, count)
  return chosen.map((item) => {
    const distractors = shuffle(allItems.filter((a) => a.id !== item.id)).slice(0, 2)
    const options = shuffle([item, ...distractors]).map((o) => ({
      id: o.id, label: o.text, emoji: o.emoji,
    }))
    return {
      correctId: item.id,
      prompt: 'Which word did you hear?',
      speakText: item.text,
      options,
    }
  })
}

export function buildQuestions(category, count = 5) {
  if (category === 'alphabet') return buildAlphabetQuestions(count)
  if (category === 'phonics') return buildPhonicsQuestions(count)
  if (category === 'words') return buildWordsQuestions(count)
  return []
}
