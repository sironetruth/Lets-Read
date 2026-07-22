import { useEffect, useState } from 'react'
import {
  getAllVoices, getStoredVoiceURI, setStoredVoiceURI,
  getRateMultiplier, setRateMultiplier, speak, isSpeechSupported,
} from '../utils/speech'

export default function VoiceSettings() {
  const [open, setOpen] = useState(false)
  const [voices, setVoices] = useState([])
  const [selected, setSelected] = useState(getStoredVoiceURI())
  const [speed, setSpeed] = useState(getRateMultiplier())

  useEffect(() => {
    if (!isSpeechSupported()) return
    const load = () => {
      const list = getAllVoices()
      if (list.length) setVoices(list)
    }
    load()
    window.speechSynthesis.onvoiceschanged = load
  }, [])

  if (!isSpeechSupported()) return null

  const englishVoices = voices.filter(v => v.lang && v.lang.startsWith('en'))
  const listToShow = englishVoices.length ? englishVoices : voices

  return (
    <div className="voice-settings">
      <button
        type="button"
        className="voice-settings__toggle"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        🔊 Voice
      </button>
      {open && (
        <div className="voice-settings__panel">
          <label className="voice-settings__label">
            Reading voice
            <select
              value={selected}
              onChange={(e) => {
                setSelected(e.target.value)
                setStoredVoiceURI(e.target.value)
              }}
            >
              <option value="">Auto (best available)</option>
              {listToShow.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name}
                </option>
              ))}
            </select>
          </label>
          <label className="voice-settings__label">
            Speed
            <select
              value={speed}
              onChange={(e) => {
                const val = parseFloat(e.target.value)
                setSpeed(val)
                setRateMultiplier(val)
              }}
            >
              <option value="0.75">Slower</option>
              <option value="0.9">Slow</option>
              <option value="1">Normal</option>
            </select>
          </label>
          <button
            type="button"
            className="voice-settings__test"
            onClick={() => speak("Hi! I'm Kiwi. Let's read together!")}
          >
            ▶ Test voice
          </button>
          <p className="voice-settings__hint">
            Sounds robotic? Try Chrome or Edge — they include higher-quality
            "Natural" voices your OS voices may not have.
          </p>
        </div>
      )}
    </div>
  )
}
