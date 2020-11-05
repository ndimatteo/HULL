import React, { useState } from 'react'

import { clampRange } from '../../lib/helpers'

const Counter = ({ setCount }) => {
  const [lineQuantity, setLineQuantity] = useState(1)

  const updateQuantity = (num) => {
    const cnum = clampRange(num, [1, 10])

    // Bail if no change
    if (cnum === lineQuantity) return

    setLineQuantity(cnum)
    if (cnum && setCount) {
      setCount(cnum)
    }
  }
  return (
    <div className="counter">
      <button
        onClick={() => updateQuantity(lineQuantity - 1)}
        className="counter--down"
      >
        -
      </button>
      <input
        onChange={(e) => updateQuantity(parseInt(e.currentTarget.value, 10))}
        className="counter--amount"
        type="number"
        inputMode="numeric"
        min="1"
        value={lineQuantity ? lineQuantity : ''}
      />
      <button
        onClick={() => updateQuantity(lineQuantity + 1)}
        className="counter--up"
      >
        +
      </button>
    </div>
  )
}

export default Counter
