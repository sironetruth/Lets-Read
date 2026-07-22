// --- Helpers to build the 1-100 numbers list programmatically ---
const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven',
  'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
  'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty',
  'seventy', 'eighty', 'ninety']
const KEYCAP = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']

function numberToWords(n) {
  if (n === 100) return 'one hundred'
  if (n < 20) return ONES[n]
  const tens = Math.floor(n / 10)
  const ones = n % 10
  return ones === 0 ? TENS[tens] : `${TENS[tens]}-${ONES[ones]}`
}

function numberToKeycaps(n) {
  return String(n).split('').map((d) => KEYCAP[Number(d)]).join('')
}

function buildNumbers() {
  const list = []
  for (let n = 1; n <= 100; n++) {
    list.push({
      id: `numbers-${n}`,
      text: numberToWords(n),
      emoji: numberToKeycaps(n),
    })
  }
  return list
}

export const wordCategories = [
  {
    id: 'animals',
    title: 'Animals',
    color: 'grass',
    items: [
      { id: 'animals-dog', text: 'dog', emoji: '🐶' },
      { id: 'animals-cat', text: 'cat', emoji: '🐱' },
      { id: 'animals-bird', text: 'bird', emoji: '🐦' },
      { id: 'animals-fish', text: 'fish', emoji: '🐟' },
      { id: 'animals-bear', text: 'bear', emoji: '🐻' },
      { id: 'animals-frog', text: 'frog', emoji: '🐸' },
      { id: 'animals-lion', text: 'lion', emoji: '🦁' },
      { id: 'animals-elephant', text: 'elephant', emoji: '🐘' },
      { id: 'animals-monkey', text: 'monkey', emoji: '🐵' },
      { id: 'animals-horse', text: 'horse', emoji: '🐴' },
      { id: 'animals-duck', text: 'duck', emoji: '🦆' },
      { id: 'animals-rabbit', text: 'rabbit', emoji: '🐰' },
      { id: 'animals-turtle', text: 'turtle', emoji: '🐢' },
      { id: 'animals-owl', text: 'owl', emoji: '🦉' },
    ],
  },
  {
    id: 'colors',
    title: 'Colors',
    color: 'grape',
    items: [
      { id: 'colors-red', text: 'red', emoji: '🟥' },
      { id: 'colors-orange', text: 'orange', emoji: '🟧' },
      { id: 'colors-yellow', text: 'yellow', emoji: '🟨' },
      { id: 'colors-green', text: 'green', emoji: '🟩' },
      { id: 'colors-blue', text: 'blue', emoji: '🟦' },
      { id: 'colors-purple', text: 'purple', emoji: '🟪' },
      { id: 'colors-brown', text: 'brown', emoji: '🟫' },
      { id: 'colors-black', text: 'black', emoji: '⬛' },
      { id: 'colors-white', text: 'white', emoji: '⬜' },
      { id: 'colors-pink', text: 'pink', emoji: '🌸' },
    ],
  },
  {
    id: 'family',
    title: 'Family',
    color: 'coral',
    items: [
      { id: 'family-mom', text: 'mom', emoji: '👩' },
      { id: 'family-dad', text: 'dad', emoji: '👨' },
      { id: 'family-baby', text: 'baby', emoji: '👶' },
      { id: 'family-sister', text: 'sister', emoji: '👧' },
      { id: 'family-brother', text: 'brother', emoji: '👦' },
      { id: 'family-grandma', text: 'grandma', emoji: '👵' },
      { id: 'family-grandpa', text: 'grandpa', emoji: '👴' },
    ],
  },
  {
    id: 'food',
    title: 'Food',
    color: 'sun',
    items: [
      { id: 'food-milk', text: 'milk', emoji: '🥛' },
      { id: 'food-bread', text: 'bread', emoji: '🍞' },
      { id: 'food-egg', text: 'egg', emoji: '🥚' },
      { id: 'food-banana', text: 'banana', emoji: '🍌' },
      { id: 'food-cookie', text: 'cookie', emoji: '🍪' },
      { id: 'food-cheese', text: 'cheese', emoji: '🧀' },
      { id: 'food-apple', text: 'apple', emoji: '🍎' },
      { id: 'food-orange', text: 'orange', emoji: '🍊' },
      { id: 'food-grapes', text: 'grapes', emoji: '🍇' },
      { id: 'food-watermelon', text: 'watermelon', emoji: '🍉' },
      { id: 'food-pizza', text: 'pizza', emoji: '🍕' },
      { id: 'food-sandwich', text: 'sandwich', emoji: '🥪' },
      { id: 'food-carrot', text: 'carrot', emoji: '🥕' },
      { id: 'food-broccoli', text: 'broccoli', emoji: '🥦' },
      { id: 'food-rice', text: 'rice', emoji: '🍚' },
      { id: 'food-soup', text: 'soup', emoji: '🍲' },
      { id: 'food-cake', text: 'cake', emoji: '🍰' },
      { id: 'food-icecream', text: 'ice cream', emoji: '🍦' },
      { id: 'food-popcorn', text: 'popcorn', emoji: '🍿' },
      { id: 'food-juice', text: 'juice', emoji: '🧃' },
    ],
  },
  {
    id: 'numbers',
    title: 'Numbers',
    color: 'sky',
    items: buildNumbers(),
  },
]
