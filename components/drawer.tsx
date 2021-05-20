import * as React from 'react'
import ReactDOM from 'react-dom'
import { m, AnimatePresence } from 'framer-motion'
import FocusTrap from 'focus-trap-react'

interface DrawerProps {
  title: string
  open: boolean
  toggle: (value: boolean) => void
  children?: React.ReactChild
}

const Drawer: React.FC<DrawerProps> = ({
  title,
  open,
  toggle,
  children,
}: DrawerProps) => {
  if (typeof document === 'undefined') {
    return null
  }

  const toggleBodyClass = (state: boolean) => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('drawer-open', state)
    }
  }

  React.useEffect(() => {
    toggleBodyClass(open)
  }, [open])

  const portalElement = document.getElementById('drawer')

  if (!portalElement) return null

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
    portalElement
  )
}

export default Drawer
