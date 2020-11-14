import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getStaticRoute, getDynamicRoute, getActive } from '../lib/routes'

const Dropdown = ({ title, items }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const isOpen = open

  const handleBlur = (e) => {
    const currentTarget = e.currentTarget

    // Check the newly focused element in the next tick of the event loop
    setTimeout(() => {
      // Check if the new activeElement is a child of the original container
      if (!currentTarget.contains(document.activeElement)) {
        // You can invoke a callback or add custom logic here
        setOpen(false)
      }
    }, 0)
  }

  const toggleDropdown = (toggle) => {
    setOpen(toggle)
    setExpanded(!expanded)
  }

  const variants = {
    expanded: {
      height: 'auto',
    },
    collapsed: {
      height: 0,
    },
  }

  return (
    <div
      className={`dropdown${isOpen ? ' is-open is-expanded"' : ''}`}
      onMouseLeave={() => setOpen(false)}
      onMouseEnter={() => setOpen(true)}
      onBlur={handleBlur}
    >
      <button className="dropdown--btn" onClick={() => toggleDropdown(!isOpen)}>
        {title}
      </button>
      <motion.div
        className="dropdown--content"
        initial={expanded ? 'expanded' : 'collapsed'}
        animate={expanded ? 'expanded' : 'collapsed'}
        variants={variants}
        transition={{ duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] }}
      >
        <ul className="dropdown--nav">
          {items.map((item, key) => {
            const isLink = !!item.link
            const isStatic = getStaticRoute(item.type)

            // External Link
            if (isLink) {
              return (
                <li key={key}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={item.isButton ? 'btn' : null}
                  >
                    {item.title}
                  </a>
                </li>
              )

              // Internal Page
            } else {
              const isActive = getActive(isStatic, item.page.slug, router)
              const isDynamic = getDynamicRoute(item.page.type)

              return (
                <li key={key} className={isActive ? 'is-active' : null}>
                  <Link
                    href={
                      isStatic
                        ? `/${isStatic}`
                        : `/${isDynamic ? `${isDynamic}/` : ''}${
                            item.page.slug
                          }`
                    }
                    scroll={false}
                  >
                    <a className={item.isButton ? 'btn' : null}>{item.title}</a>
                  </Link>
                </li>
              )
            }
          })}
        </ul>
      </motion.div>
    </div>
  )
}

export default Dropdown
