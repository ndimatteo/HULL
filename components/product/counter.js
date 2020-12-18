import React, { useState, useCallback } from 'react'
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

const Counter = React.memo(({ defaultCount = 1, onUpdate, max }) => {
  const [lineQuantity, setLineQuantity] = useState(defaultCount)

  const [direction, setDirection] = useState(1)
  const [motionKey, setMotionKey] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const animateQuantity = useCallback((amount, direction) => {
    const count = max ? clampRange(amount, 1, max) : amount

    // Bail if at edges
    if (count < 1 || count > max) return

    setIsAnimating(true)
    setDirection(direction)
    setMotionKey(count + (direction > 0 ? '-up' : '-down'))
    setLineQuantity(count)

    if (onUpdate) {
      onUpdate(count)
    }
  }, [])

  const updateQuantity = useCallback((amount) => {
    const count = max ? clampRange(amount, 1, max) : amount

    if (count < 1) return

    setIsAnimating(false)
    setLineQuantity(count)

    if (onUpdate) {
      onUpdate(count)
    }
  }, [])

  return (
    <div className="counter">
      <button
        aria-label="Decrease quantity by one"
        onClick={() => animateQuantity(lineQuantity - 1, -1)}
        className="counter--down"
      >
        -
      </button>
      <div className="counter--amount">
        <AnimatePresence custom={direction}>
          <motion.div
            key={motionKey}
            initial={isAnimating ? 'hide' : 'show'}
            animate="show"
            exit="hide"
            variants={flipAnim}
            custom={direction}
            className="counter--input"
          >
            <input
              onChange={(e) =>
                updateQuantity(parseInt(e.currentTarget.value, 10))
              }
              onBlur={(e) => isNaN(lineQuantity) && updateQuantity(1)}
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
        onClick={() => animateQuantity(lineQuantity + 1, 1)}
        className="counter--up"
      >
        +
      </button>
    </div>
  )
})

export default Counter
