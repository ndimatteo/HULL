import React, { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import Cookies from 'js-cookie'

import { useHasMounted } from '@lib/helpers'
import CustomLink from '@components/link'

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

const CookieBar = React.memo(({ data = {} }) => {
  const { message, link } = data

  const hasMounted = useHasMounted()
  const { acceptedCookies, onAcceptCookies } = useAcceptCookies()

  if (!hasMounted || !message) return null

  return (
    <AnimatePresence>
      {!acceptedCookies && (
        <m.div
          initial="hide"
          animate="show"
          exit="hide"
          variants={barAnim}
          role="dialog"
          aria-live="polite"
          className="cookie-bar"
        >
          <div className="cookie-bar--content">
            <div className="cookie-bar--message">
              <p>
                {message.split('\n').map((text, i) => {
                  // using React.fragment to parse line breaks
                  return (
                    <React.Fragment key={i}>
                      {text}
                      {message.split('\n')[i + 1] && <br />}
                    </React.Fragment>
                  )
                })}
              </p>
            </div>

            <div className="cookie-bar--actions">
              {link && (
                <CustomLink
                  className="btn is-text"
                  link={{ ...{ page: link }, ...{ title: 'Learn More' } }}
                />
              )}
              <button
                onClick={() => onAcceptCookies()}
                className="btn is-primary is-inverted"
              >
                Accept
              </button>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
})

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
