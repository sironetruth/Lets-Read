import { Link } from 'react-router-dom'

const PRETTY = {
  alphabet: { label: 'Alphabet', to: '/alphabet' },
  phonics: { label: 'Phonics', to: '/phonics' },
  words: { label: 'Simple Words', to: '/words' },
  sentences: { label: 'Sentences', to: '/sentences' },
}

export default function LockedNotice({ requires }) {
  const prev = PRETTY[requires]
  return (
    <div className="locked-notice">
      <div className="locked-notice__emoji">🔒</div>
      <h2>Almost there!</h2>
      <p>
        Finish the <strong>{prev?.label}</strong> quiz first to unlock this
        section and win a new ride.
      </p>
      <Link to={prev?.to || '/'} className="locked-notice__button">
        Go to {prev?.label}
      </Link>
    </div>
  )
}
