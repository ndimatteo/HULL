import { useRouter } from 'next/router'
import React from 'react'
import CustomLink from '@/components/link'
import type API from '@/lib/shared-types'

interface PromoBarProps {
  data: API['PromoData']
}

const PromoBar = React.memo(({ data }: PromoBarProps) => {
  const text = data?.text,
    link = data?.link,
    display = data?.display

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
          text
        )}
      </div>
    </div>
  )
})

export default PromoBar
