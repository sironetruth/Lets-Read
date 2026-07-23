// Thin wrapper around the browser's SpeechSynthesis API, tuned for
// slow, clear, friendly pronunciation aimed at very young listeners.

const VOICE_KEY = 'readWithMe.voice.v1'
const RATE_KEY = 'readWithMe.rateMultiplier.v1'

let cachedVoice = null

export function getStoredVoiceURI() {
  try {
    return localStorage.getItem(VOICE_KEY) || ''
  } catch (e) {
    return ''
  }
}

export function setStoredVoiceURI(voiceURI) {
  try {
    if (voiceURI) localStorage.setItem(VOICE_KEY, voiceURI)
    else localStorage.removeItem(VOICE_KEY)
  } catch (e) {
    console.warn('Could not save voice preference', e)
  }
  cachedVoice = null
}

export function getRateMultiplier() {
  try {
    const value = parseFloat(localStorage.getItem(RATE_KEY))
    return Number.isFinite(value) ? value : 1
  } catch (e) {
    return 1
  }
}

export function setRateMultiplier(value) {
  try {
    localStorage.setItem(RATE_KEY, String(value))
  } catch (e) {
    console.warn('Could not save speed preference', e)
  }
}

export function getAllVoices() {
  if (!isSpeechSupported()) return []
  return window.speechSynthesis.getVoices() || []
}

function pickVoice() {
  if (!('speechSynthesis' in window)) return null
  const voices = window.speechSynthesis.getVoices()
  if (!voices || voices.length === 0) return null

  const storedURI = getStoredVoiceURI()
  if (storedURI) {
    const stored = voices.find(v => v.voiceURI === storedURI)
    if (stored) return stored
  }

  // Prefer higher-quality / "natural" voices over default robotic system
  // voices (e.g. Microsoft David/Zira on Windows).
  const preferredNames = [
    'Google US English', 'Samantha', 'Microsoft Aria Online (Natural)',
    'Microsoft Jenny Online (Natural)', 'Microsoft Guy Online (Natural)',
    'Karen', 'Moira', 'Fiona',
  ]
  let voice = voices.find(v => preferredNames.some(name => v.name.includes(name)))
  if (!voice) voice = voices.find(v => /natural|online/i.test(v.name) && v.lang?.startsWith('en'))
  if (!voice) voice = voices.find(v => v.lang && v.lang.startsWith('en'))
  if (!voice) voice = voices[0]
  return voice || null
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = pickVoice()
  }
}

export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(text, { rate = 0.8, pitch = 1.08, onEnd } = {}) {
  if (!isSpeechSupported() || !text) return

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = Math.max(0.4, rate * getRateMultiplier())
  utterance.pitch = pitch
  utterance.volume = 1

  if (!cachedVoice) cachedVoice = pickVoice()
  if (cachedVoice) utterance.voice = cachedVoice

  if (onEnd) utterance.onend = onEnd

  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  if (isSpeechSupported()) window.speechSynthesis.cancel()
}

// A bouncier, higher-pitched preset used for Kiwi's own lines (greetings,
// cheers) so the mascot feels like a distinct character rather than the
// same neutral voice used to read words.
export function speakAsCharacter(text, { onEnd } = {}) {
  speak(text, { rate: 0.95, pitch: 1.4, onEnd })
}