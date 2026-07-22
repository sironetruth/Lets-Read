export default function ProgressSummary({ label, learned, total, accent }) {
  const pct = total > 0 ? Math.round((learned / total) * 100) : 0
  return (
    <div className={`progress-summary progress-summary--${accent}`}>
      <div className="progress-summary__top">
        <span className="progress-summary__label">{label}</span>
        <span className="progress-summary__count">{learned}/{total}</span>
      </div>
      <div className="progress-summary__track">
        <div className="progress-summary__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
