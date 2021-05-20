import React, { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { useHasMounted } from '@/lib/helpers'
import Cookies from 'js-cookie'
import CustomLink from '@/components/link'
import type API from '@/lib/shared-types'

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

interface CookieBarProps {
  data: {
    message: string
    link?: API['LinkPage']
  }
}

const defaultText = {
  message: 'sorry',
  link: undefined,
}

const CookieBar = React.memo(({ data = defaultText }: CookieBarProps) => {
  const message = data?.message ?? 'sorry'
  const link = data?.link

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
                  //TODO: pass styles
                  // className="btn is-text"
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
