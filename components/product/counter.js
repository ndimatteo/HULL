import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { clampRange } from '../../lib/helpers'

const flipAnim = {
  show: (custom) => ({
    y: [`${100 * custom}%`, '0%'],
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
      when: 'beforeChildren',
    },
  }),
  hide: (custom) => ({
    y: ['0%', `${-100 * custom}%`],
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
      when: 'afterChildren',
    },
  }),
}

function Counter({ defaultCount = 1, onUpdate, max }) {
  const [lineQuantity, setLineQuantity] = useState(defaultCount)
  const [direction, setDirection] = useState(1)
  const [flipKey, setFlipKey] = useState(`${defaultCount}/1`)

  const updateQuantity = (num, direction) => {
    const cnum = max ? clampRange(num, [1, max]) : num

    // Bail if no change
    if (cnum === lineQuantity || cnum < 1) return

    // update the quantity count
    setLineQuantity(cnum)

    // check for a direction change
    if (direction) {
      setDirection(direction)
      setFlipKey(`${cnum}/${direction}`)
    }

    // fire callback if provided
    if (cnum && onUpdate) {
      onUpdate(cnum)
    }
  }

  return (
    <div className="counter">
      <button
        aria-label="Decrease quantity by one"
        onClick={() => updateQuantity(lineQuantity - 1, -1)}
        className="counter--down"
      >
        -
      </button>
      <div className="counter--amount">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={flipKey}
            animate="show"
            exit="hide"
            variants={flipAnim}
            custom={direction}
            className="counter--input"
          >
            <input
              onChange={(e) =>
                updateQuantity(parseInt(e.currentTarget.value, 10), false)
              }
              type="number"
              inputMode="numeric"
              min="1"
              value={lineQuantity ? lineQuantity : ''}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <button
        aria-label="Increase quantity by one"
        onClick={() => updateQuantity(lineQuantity + 1, 1)}
        className="counter--up"
      >
        +
      </button>
    </div>
  )
}

export default Counter
