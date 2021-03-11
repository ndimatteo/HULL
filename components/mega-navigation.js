import React, { useRef, useState } from 'react'
import FocusTrap from 'focus-trap-react'
import { motion } from 'framer-motion'
import { useRect } from '@reach/rect'
import cx from 'classnames'

import { useSiteContext } from '../lib/contexts'
import { useToggleMegaNav } from '../lib/contexts/site'

import Navigation from './navigation'

const MegaNavigation = ({ items = [], headerHeight }) => {
  const dropdowns = items.filter((item) => {
    return 'dropdownItems' in item
  })

  if (!dropdowns.length) return null

  const toggleMegaNav = useToggleMegaNav()
  const { meganav } = useSiteContext()
  const activeNav = useRef()
  const activeNavRect = useRect(activeNav)
  const [hasFocus, setHasFocus] = useState(false)

  const handleKeyup = (e) => {
    if (e.which === 27) {
      toggleMegaNav(false)
    }
  }

  return (
    <>
      <FocusTrap
        active={meganav.isOpen && hasFocus}
        focusTrapOptions={{ allowOutsideClick: true }}
      >
        <div
          ref={!meganav.isOpen ? activeNav : null}
          className="mega-navigation"
          onKeyUp={(e) => handleKeyup(e)}
        >
          {dropdowns.map((dropdown, key) => {
            const isActive =
              meganav.isOpen && meganav.activeID === dropdown._key

            return (
              <div
                key={key}
                ref={isActive ? activeNav : null}
                id={`meganav-${dropdown._key}`}
                className={cx('mega-item', {
                  'pointer-events-none': !isActive,
                  'is-showing': isActive,
                })}
              >
                <div className="mega-item--outer">
                  <div className="mega-item--inner">
                    <motion.div
                      initial="hide"
                      animate={isActive ? 'show' : 'hide'}
                      onAnimationComplete={() => setHasFocus(isActive)}
                      variants={{
                        show: {
                          opacity: 1,
                          x: ['-2rem', '0rem'],
                          transition: {
                            x: {
                              duration: 0.8,
                              delay: 0.1,
                              ease: [0.16, 1, 0.3, 1],
                            },
                            opacity: {
                              duration: 0.2,
                              delay: 0.1,
                            },
                          },
                        },
                        hide: {
                          x: ['0rem', '2rem'],
                          opacity: 0,
                          transition: {
                            x: {
                              duration: 0.4,
                              ease: [0.16, 1, 0.3, 1],
                            },
                            opacity: {
                              duration: 0.1,
                            },
                          },
                        },
                      }}
                      className="mega-item--content"
                    >
                      <Navigation
                        items={dropdown.dropdownItems}
                        hasFocus={hasFocus && isActive}
                        onClick={() => toggleMegaNav(false)}
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </FocusTrap>
      <div
        className={cx('mega-navigation--bg')}
        style={{
          transform: `scaleY(${
            meganav.isOpen ? activeNavRect?.height + headerHeight : 0
          })`,
        }}
      />
    </>
  )
}

export const MegaDropdownButton = ({ title, id }) => {
  const toggleMegaNav = useToggleMegaNav()
  const { meganav } = useSiteContext()

  const isActive = meganav.activeID === id

  return (
    <button
      className={cx('mega-toggle', { 'is-open': isActive })}
      aria-expanded={isActive}
      aria-controls={`meganav-${id}`}
      onClick={() => toggleMegaNav(!isActive ? true : 'toggle', id)}
    >
      <span className="mega-toggle--icon" />
      {title}
    </button>
  )
}

export const MegaNavigationBackdrop = () => {
  const toggleMegaNav = useToggleMegaNav()
  const { meganav } = useSiteContext()

  return (
    <motion.div
      initial="hide"
      animate={meganav.isOpen ? 'show' : 'hide'}
      variants={{
        show: {
          opacity: 1,
          transition: {
            duration: 0.3,
            ease: 'linear',
          },
        },
        hide: {
          opacity: 0,
          transition: {
            duration: 0.3,
            delay: 0.3,
            ease: 'linear',
          },
        },
      }}
      className={cx('mega-navigation--backdrop', {
        'pointer-events-none': !meganav.isOpen,
      })}
      onClick={() => toggleMegaNav(false)}
    />
  )
}

export default MegaNavigation
