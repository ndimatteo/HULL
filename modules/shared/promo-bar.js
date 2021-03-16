import React from 'react'
import { useRouter } from 'next/router'

import CustomLink from '@components/link'

const PromoBar = React.memo(({ data = {} }) => {
  const { text, link, display } = data
  const router = useRouter()

  // bail if no display or text
  if (!display || !display.trim() || !text) return null

  // bail if display set to homepage and we're not on the homepage
  if (display === 'home' && router.asPath !== '/') return null

  return (
    <div className="promo-bar">
      <div className="promo-bar--content">
        {link ? (
          <CustomLink
            className="promo-bar--link"
            link={{ ...{ page: link }, ...{ title: text } }}
          />
        ) : (
          { text }
        )}
      </div>
    </div>
  )
})

export default PromoBar
