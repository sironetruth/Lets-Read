import { CARS, getCarLevel } from '../utils/unlocks'

export default function CarAvatar({ size = 48 }) {
  const level = getCarLevel()
  const car = CARS[Math.min(level, CARS.length - 1)]
  return (
    <span
      className="car-avatar"
      style={{ fontSize: size }}
      role="img"
      aria-label={`Your current ride: ${car.label}`}
      title={car.label}
    >
      {car.emoji}
    </span>
  )
}
