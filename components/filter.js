import React, { useState, useEffect, useRef } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import FocusTrap from 'focus-trap-react'
import cx from 'classnames'

import { Keys } from '@lib/helpers'
import { itemAnim } from '@lib/animate'

import RadioGroup from '@components/radio-group'
import RadioItem from '@components/radio-item'

const Filter = ({ name, displayTitle, options, activeOption, onChange }) => {
  const groupRef = useRef()
  const [isOpen, setIsOpen] = useState(false)

  const defaultOption = options[0].slug
  const currentOption = options.find((option) => option.slug === activeOption)

  const handleOnChange = (value) => {
    onChange(name, value)
    setIsOpen(false)
  }

  const onOutsideClick = (e) => {
    if (groupRef.current.contains(e.target)) return
    setIsOpen(false)
  }

  function handleKeyDown(e) {
    let flag = false

    switch (e.keyCode) {
      case Keys.ESC: {
        setIsOpen(false)
        flag = true
        break
      }

      default:
        break
    }

    if (flag) {
      e.stopPropagation()
      e.preventDefault()
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', onOutsideClick)

    return () => {
      document.removeEventListener('mousedown', onOutsideClick)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div ref={groupRef} className="filter-group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cx('filter-group--btn', { 'is-open': isOpen })}
      >
        <span className="filter-group--btn-icon"></span>
        {displayTitle}
        {currentOption.title}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <FocusTrap
            focusTrapOptions={{
              clickOutsideDeactivates: true,
            }}
          >
            <div className="filter-group--content">
              <m.div
                initial="hide"
                animate="show"
                exit="hide"
                variants={{
                  show: {
                    y: '0%',
                  },
                  hide: {
                    y: '-120%',
                  },
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="filter-group--dropdown"
              >
                <RadioGroup
                  value={activeOption}
                  onChange={(value) => handleOnChange(value)}
                  className="filter is-dropdown"
                >
                  {options.map((option, key) => {
                    return (
                      <RadioItem
                        key={key}
                        value={option.slug}
                        className={cx('filter--item', {
                          'is-active': option.slug === defaultOption,
                        })}
                      >
                        {option.title}
                      </RadioItem>
                    )
                  })}
                </RadioGroup>
              </m.div>
            </div>
          </FocusTrap>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Filter
