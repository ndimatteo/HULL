import React, { useState } from 'react'
import { m } from 'framer-motion'
import { useRouter } from 'next/router'

import { getStaticRoute, getActive } from '@lib/routes'
import CustomLink from '@components/link'

const Dropdown = ({ id, title, items, onClick }) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const dropdownAnim = {
    open: {
      opacity: 1,
      height: 'auto',
    },
    closed: {
      opacity: 0,
      height: 0,
    },
  }

  return (
    <div className="dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`dropdown-${id}`}
        className="dropdown--toggle"
      >
        <span className="dropdown--icon" />
        {title}
      </button>
      <m.div
        id={`dropdown-${id}`}
        className="dropdown--content"
        initial={isOpen ? 'open' : 'closed'}
        animate={isOpen ? 'open' : 'closed'}
        variants={dropdownAnim}
        transition={{ duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] }}
      >
        <ul className="dropdown--nav">
          {items.map((item, key) => {
            const isStatic = getStaticRoute(item.page?.type)
            const isActive = getActive(isStatic, item.page?.slug, router)

            return (
              <li key={key} className={isActive ? 'is-active' : null}>
                <CustomLink
                  tabIndex={!isOpen ? -1 : null}
                  link={item}
                  onClick={onClick}
                />
              </li>
            )
          })}
        </ul>
      </m.div>
    </div>
  )
}

export default Dropdown
