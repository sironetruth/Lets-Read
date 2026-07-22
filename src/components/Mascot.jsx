export default function Mascot({ size = 120, mood = 'happy', className = '' }) {
  // Kiwi the reading parrot — the app's signature character.
  return (
    <svg
      className={`mascot mascot--${mood} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* tail feathers */}
      <path d="M40 130 C10 120, 5 150, 20 168 C 35 155, 42 142, 40 130 Z" fill="var(--color-coral)" />
      <path d="M46 145 C 22 148, 20 175, 38 185 C 48 170, 50 156, 46 145 Z" fill="var(--color-sun)" />

      {/* body */}
      <ellipse cx="105" cy="120" rx="62" ry="58" fill="var(--color-grape)" />
      {/* belly */}
      <ellipse cx="112" cy="132" rx="38" ry="34" fill="var(--color-sun)" />

      {/* wing */}
      <path className="mascot__wing" d="M148 95 C 178 100, 182 140, 152 155 C 140 135, 138 112, 148 95 Z" fill="var(--color-grass)" />

      {/* head */}
      <circle cx="98" cy="70" r="48" fill="var(--color-sky)" />

      {/* eye patch */}
      <circle cx="112" cy="62" r="20" fill="white" />
      <circle className="mascot__eye" cx="116" cy="62" r="9" fill="var(--color-ink)" />
      <circle cx="119" cy="58" r="2.5" fill="white" />

      {/* beak */}
      <path d="M138 66 C 158 68, 158 82, 140 86 C 130 82, 128 70, 138 66 Z" fill="var(--color-sun)" />
      <path d="M136 82 C 148 84, 148 90, 138 92 C 132 88, 132 84, 136 82 Z" fill="#E0A415" />

      {/* head crest feathers */}
      <path d="M78 30 C 70 12, 84 8, 90 22 Z" fill="var(--color-coral)" />
      <path d="M92 22 C 88 4, 104 4, 104 18 Z" fill="var(--color-grass)" />
      <path d="M106 22 C 108 6, 122 10, 116 26 Z" fill="var(--color-sun)" />

      {/* feet */}
      <path d="M88 172 L84 186 M88 172 L90 188 M88 172 L96 184" stroke="var(--color-sun)" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M122 172 L118 186 M122 172 L124 188 M122 172 L130 184" stroke="var(--color-sun)" strokeWidth="5" strokeLinecap="round" fill="none" />
    </svg>
  )
}
