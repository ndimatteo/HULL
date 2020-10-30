import React, { useEffect, useContext } from 'react'
import ReactDOM from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

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
        <>
          <motion.div
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
          />
          <motion.nav
            key="drawer"
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              open: { x: '0%' },
              closed: { x: '100%' },
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
          </motion.nav>
        </>
      )}
    </AnimatePresence>,
    document.querySelector('#drawer')
  )
}

export default Drawer
