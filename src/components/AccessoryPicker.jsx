import { useState } from 'react'
import {
  ACCESSORIES, isAccessoryUnlocked, getEquippedAccessoryId, setEquippedAccessoryId,
} from '../utils/accessories'

export default function AccessoryPicker({ onChange }) {
  const [equipped, setEquipped] = useState(getEquippedAccessoryId())

  const handlePick = (accessory) => {
    if (!isAccessoryUnlocked(accessory)) return
    setEquippedAccessoryId(accessory.id)
    setEquipped(accessory.id)
    onChange?.(accessory.emoji)
  }

  return (
    <div className="accessory-picker">
      <p className="accessory-picker__title">🎨 Dress up Kiwi!</p>
      <div className="accessory-picker__row">
        {ACCESSORIES.map((acc) => {
          const unlocked = isAccessoryUnlocked(acc)
          const isEquipped = equipped === acc.id
          return (
            <button
              key={acc.id}
              type="button"
              className={`accessory-chip ${isEquipped ? 'accessory-chip--equipped' : ''} ${!unlocked ? 'accessory-chip--locked' : ''}`}
              onClick={() => handlePick(acc)}
              disabled={!unlocked}
              title={unlocked ? acc.label : `Pass the ${acc.unlockedBy} quiz to unlock`}
            >
              {unlocked ? (acc.emoji || '🚫') : '🔒'}
            </button>
          )
        })}
      </div>
    </div>
  )
}
