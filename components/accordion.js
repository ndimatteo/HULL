import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Accordion = ({ toggle, onChange, id, title, children }) => {
  const [open, setOpen] = useState(toggle)

  useEffect(() => {
    setOpen(toggle)
  }, [toggle])

  useEffect(() => {
    if (onChange) {
      onChange(id, open)
    }
  }, [open])

  return (
    <div key={id} className="accordion">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className={`accordion--toggle${open ? ' is-open' : ''}`}
      >
        {title}
        <div className="accordion--icon" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] }}
            className="accordion--content"
          >
            <div className="accordion--inner">{children}</div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Accordion
