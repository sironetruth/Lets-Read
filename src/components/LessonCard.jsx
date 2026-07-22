import SpeakButton from './SpeakButton'

export default function LessonCard({
  emoji,
  title,
  subtitle,
  speakText,
  accent = 'sun',
  complete = false,
  onToggleComplete,
  onClick,
  big = false,
}) {
  return (
    <div
      className={`lesson-card lesson-card--${accent} ${complete ? 'lesson-card--complete' : ''} ${big ? 'lesson-card--big' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {complete && <span className="lesson-card__star" aria-label="Completed">⭐</span>}
      <div className="lesson-card__emoji" aria-hidden="true">{emoji}</div>
      <div className="lesson-card__title">{title}</div>
      {subtitle && <div className="lesson-card__subtitle">{subtitle}</div>}
      <div className="lesson-card__actions">
        <SpeakButton text={speakText || title} />
        {onToggleComplete && (
          <button
            type="button"
            className="mark-btn"
            onClick={(e) => {
              e.stopPropagation()
              onToggleComplete()
            }}
          >
            {complete ? 'Learned ✓' : 'Mark as learned'}
          </button>
        )}
      </div>
    </div>
  )
}
