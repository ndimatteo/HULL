import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Cookies from 'js-cookie'

import { useHasMounted } from '@lib/helpers'

const barAnim = {
  show: {
    y: '0%',
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  hide: {
    y: '100%',
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

const CookieBar = () => {
  const hasMounted = useHasMounted()
  const { acceptedCookies, onAcceptCookies } = useAcceptCookies()

  if (!hasMounted) return null

  return (
    <AnimatePresence>
      {!acceptedCookies && (
        <motion.div
          initial="hide"
          animate="show"
          exit="hide"
          variants={barAnim}
          role="dialog"
          aria-live="polite"
          className="cookie-bar is-inverted"
        >
          <div className="cookie-bar--content">
            <div className="cookie-bar--message">
              <p>
                We use cookies to personalize and deliver appropriate content.{' '}
                <br />
                By clicking "Accept" you agree to our terms.
              </p>
            </div>

            <div className="cookie-bar--actions">
              <a href="#" className="btn is-text">
                Learn More
              </a>
              <button
                onClick={() => onAcceptCookies()}
                className="btn is-primary"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function useAcceptCookies(cookieName = 'accept_cookies') {
  const [acceptedCookies, setAcceptedCookies] = useState(true)

  useEffect(() => {
    if (!Cookies.get(cookieName)) {
      setAcceptedCookies(false)
    }
  }, [])

  const acceptCookies = () => {
    setAcceptedCookies(true)
    Cookies.set(cookieName, 'accepted', { expires: 365 })
  }

  return {
    acceptedCookies,
    onAcceptCookies: acceptCookies,
  }
}

export default CookieBar
