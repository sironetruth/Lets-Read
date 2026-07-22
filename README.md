# Read With Me 📖

A colorful, responsive reading app for toddlers aged 3–6, built as a game:
learn a section, pass its quiz, unlock the next one, and win a new ride.
100% client-side, no backend or server required.

## What's inside

- **Home** – overview with progress bars, your current car, and a star count.
- **Alphabet** – all 26 letters as colorful tappable cards; each opens a
  detail view with a picture, example word, and "Listen" button.
- **Phonics** – short vowel sounds, digraphs (sh, ch), and a blend (st).
  Sounds are spoken using a phonetic respelling (e.g. "ch" is spoken as
  "chuh") so it's closer to the real sound than the browser saying the
  letter names — see the note on TTS below.
- **Simple Words** – word cards grouped by topic: Animals (14), Colors (10),
  Family (7), Food (20), and Numbers (1–100).
- **Beginner Sentences** – short sentences read aloud as a whole, or
  word-by-word by tapping individual words.
- **My Progress** – a "road" showing your car advancing through each
  unlocked section, plus per-section stats.
- **Quizzes & unlocking** – each section (Alphabet → Phonics → Words →
  Sentences) has a short quiz at the bottom once you've learned enough of
  it. Pass the quiz to unlock the next section and win a new car (scooter →
  car → SUV → race car → rocket). Wrong answers just say "try again" —
  nothing is ever penalized, the child simply retries.
- **Voice practice (optional)** – during quizzes, if the browser supports
  it, kids can tap "🎤 Or say it out loud!" and say the answer instead of
  tapping. Speech is checked against the expected word and gives the same
  correct/try-again feedback.
- **Voice settings** – a "🔊 Voice" menu in the navbar lets you pick which
  installed voice to use and slow the speech rate down further.
- Every "Mark as learned" tap and every quiz pass is saved to
  `localStorage`, so progress persists between visits on the same device.

## Running it locally

Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (typically `http://localhost:5173`).

## Building for production

```bash
npm run build
```

This outputs a static site to `dist/`, which you can open directly, deploy to
any static host (Netlify, Vercel, GitHub Pages, S3, etc.), or serve with:

```bash
npm run preview
```

## Important browser limitations (please read)

**Text-to-speech (pronunciation):** the app uses the browser's built-in
`SpeechSynthesis` API — no external service or API key required. Voice
*quality* varies a lot by browser/OS: Chrome and Edge generally have the
best "Natural"-sounding voices; the default Windows voices (David/Zira) can
sound robotic. Use the "🔊 Voice" menu in the navbar to pick a better voice
if one is installed, and try Chrome or Edge if the default sounds off.

Isolated phonics sounds (like a pure "ch" or short "a") can't be produced
perfectly by this API — it's built to read words, not phonemes, and
browsers don't support SSML phoneme tags. The app uses the same respelling
convention many phonics programs use (e.g. "chuh", "shuh", "ahh") to get as
close as the API allows, but it will never be identical to a trained
teacher's pronunciation.

**Voice practice / speech recognition:** the "say it out loud" feature uses
the `SpeechRecognition` API, which is **only supported in Chrome and Edge**
— it does not work in Firefox or Safari. Where it's unsupported, the mic
button is hidden automatically and kids can still tap the answer instead
— nothing is blocked. It also requires microphone permission, and accuracy
for young children's speech will vary by microphone and browser.

## Notes on progress & game state

Progress and quiz results are stored in two `localStorage` keys
(`readWithMe.progress.v1` and `readWithMe.quizPassed.v1`) as JSON, scoped
per browser/device — there is no account system or server sync. Clearing
site data/browser storage will reset both progress and unlocked sections.
