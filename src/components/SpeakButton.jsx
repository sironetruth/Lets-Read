import { useState, useRef, useEffect } from 'react'
import { speak, isSpeechSupported } from '../utils/speech'

export default function SpeakButton({ text, label = 'Listen', size = 'md', rate = 0.85 }) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const handleClick = (e) => {
    e.stopPropagation()
    if (!isSpeechSupported()) return
    setIsSpeaking(true)
    speak(text, {
      rate,
      onEnd: () => {
        if (mountedRef.current) setIsSpeaking(false)
      },
    })
    // Safety timeout in case onend doesn't fire
    setTimeout(() => {
      if (mountedRef.current) setIsSpeaking(false)
    }, Math.max(1800, text.length * 160))
  }

  return (
    <button
      type="button"
      className={`speak-btn speak-btn--${size} ${isSpeaking ? 'speak-btn--active' : ''}`}
      onClick={handleClick}
      aria-label={`${label}: ${text}`}
    >
      <span className="speak-btn__icon" aria-hidden="true">
        🔊
      </span>
      <span className="speak-btn__waves" aria-hidden="true">
        <span className="wave-bar" />
        <span className="wave-bar" />
        <span className="wave-bar" />
        <span className="wave-bar" />
      </span>
    </button>
  )
}
