import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { m, AnimatePresence } from 'framer-motion'
import FocusTrap from 'focus-trap-react'

const Drawer = ({ title, open, toggle, children }) => {
  if (typeof document === `undefined`) {
    return null
  }

  const toggleBodyClass = (state) => {
    if (typeof document !== `undefined`) {
      document.body.classList.toggle('drawer-open', state)
    }
  }

  useEffect(() => {
    toggleBodyClass(open)
  }, [open])

  return ReactDOM.createPortal(
    <AnimatePresence initial={false}>
      {open && (
        <FocusTrap>
          <div className="drawer--wrapper">
            <m.div
              key="drawerBG"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { opacity: 1 },
                hidden: { opacity: 0 },
              }}
              transition={{ duration: 0.4, ease: [0.19, 1.0, 0.22, 1.0] }}
              className="drawer--backdrop"
              onClick={() => toggle(false)}
            />
            <m.nav
              key="drawer"
              initial="close"
              animate="open"
              exit="close"
              variants={{
                open: { x: '0%' },
                close: { x: '100%' },
              }}
              transition={{ duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] }}
              className="drawer"
            >
              <div className="drawer--inner">
                <div className="drawer--header">
                  {title && <div className="drawer--title">{title}</div>}
                  <button
                    className="btn drawer--close"
                    onClick={() => toggle(false)}
                  >
                    Done
                  </button>
                </div>
                <div className="drawer--content">{children}</div>
              </div>
            </m.nav>
          </div>
        </FocusTrap>
      )}
    </AnimatePresence>,
    document.querySelector('#drawer')
  )
}

export default Drawer
