import React, { useState, useCallback, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import cx from 'classnames'

import { clampRange } from '@lib/helpers'
import Icon from '@components/icon'

const flipAnim = {
  show: {
    y: '0%',
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      when: 'beforeChildren',
    },
  },
  hide: (custom) => ({
    y: `${-100 * custom}%`,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      when: 'afterChildren',
    },
  }),
  hideR: (custom) => ({
    y: `${100 * custom}%`,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      when: 'afterChildren',
    },
  }),
}

const ProductCounter = React.memo(
  ({ id, defaultCount = 1, onUpdate, max, className }) => {
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

    useEffect(() => {
      setLineQuantity(defaultCount)
    }, [defaultCount])

    return (
      <div className={cx('counter', className)}>
        <button
          aria-label="Decrease quantity by one"
          onClick={() => animateQuantity(lineQuantity - 1, -1)}
          className="counter--down"
        >
          <Icon name="Minus" id={id} />
        </button>
        <div className="counter--amount">
          <AnimatePresence custom={direction}>
            <m.div
              key={motionKey}
              initial={isAnimating ? 'hideR' : 'show'}
              animate="show"
              exit="hide"
              variants={flipAnim}
              custom={direction}
              className="counter--input"
            >
              <input
                aria-label="Manually enter quantity"
                onChange={(e) =>
                  updateQuantity(parseInt(e.currentTarget.value, 10))
                }
                onBlur={(e) => isNaN(lineQuantity) && updateQuantity(1)}
                type="number"
                inputMode="numeric"
                min="1"
                value={lineQuantity ? lineQuantity : ''}
              />
            </m.div>
          </AnimatePresence>
        </div>
        <button
          aria-label="Increase quantity by one"
          onClick={() => animateQuantity(lineQuantity + 1, 1)}
          className="counter--up"
        >
          <Icon name="Plus" id={id} />
        </button>
      </div>
    )
  }
)

export default ProductCounter
