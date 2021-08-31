import React, { useEffect, useRef, useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import FocusTrap from 'focus-trap-react'
import cx from 'classnames'

import { InPortal } from '../lib/helpers'

const Drawer = ({
  direction = 'right',
  isOpen = false,
  onClose = () => {},
  className,
  children,
}) => {
  const drawerRef = useRef()
  const [isActive, setIsActive] = useState(isOpen)

  useEffect(() => {
    setIsActive(isOpen)
  }, [isOpen])

  const handleKeyDown = (e) => {
    if (e.which === 27) {
      onClose(false)
    }
  }

  useEffect(() => {
    if (isActive) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isActive])

  return (
    <InPortal id="drawer">
      <>
        <FocusTrap
          active={isActive}
          focusTrapOptions={{
            fallbackFocus: () => drawerRef.current,
            allowOutsideClick: true,
          }}
        >
          <m.nav
            ref={drawerRef}
            key="drawer"
            initial="hide"
            animate={isActive ? 'show' : 'hide'}
            variants={{
              show: {
                x: '0%',
              },
              hide: {
                x: direction === 'right' ? '100%' : '-100%',
              },
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={cx('drawer is-inverted', className, {
              'is-right': direction === 'right',
              'is-left': direction === 'left',
              'is-active': isActive,
            })}
          >
            <div className="drawer--inner">{children}</div>
          </m.nav>
        </FocusTrap>

        <div
          className={cx('drawer--backdrop', {
            'is-active': isOpen,
          })}
          onClick={() => onClose(false)}
        />
      </>
    </InPortal>
  )
}

export default Drawer
