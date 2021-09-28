import React from 'react'
import NextLink from 'next/link'
import cx from 'classnames'

import { getStaticRoute, getDynamicRoute } from '@lib/routes'

const Link = ({ link, children, ...rest }) => {
  const isLink = !!link.url
  const isStatic = getStaticRoute(link.page?.type)

  // External Link
  if (isLink) {
    return (
      <a
        href={link.url}
        target={!link.url.match('^mailto:') ? '_blank' : null}
        rel="noopener noreferrer"
        className={
          link.isButton
            ? cx('btn', link.styles?.style, {
                'is-large': link.styles?.isLarge,
                'is-block': link.styles?.isBlock,
              })
            : null
        }
        {...rest}
      >
        {link.title || children}
      </a>
    )
    // Internal Page
  } else {
    const isDynamic = getDynamicRoute(link.page?.type)
    const isHome = link.page?.isHome

    return (
      <NextLink
        href={
          isHome
            ? '/'
            : isStatic !== false
            ? `/${isStatic}`
            : `/${isDynamic ? `${isDynamic}/` : ''}${link.page?.slug}`
        }
        scroll={false}
      >
        <a
          className={
            link.isButton
              ? cx('btn', link.styles?.style, {
                  'is-large': link.styles?.isLarge,
                  'is-block': link.styles?.isBlock,
                })
              : null
          }
          {...rest}
        >
          {link.title || children}
        </a>
      </NextLink>
    )
  }
}

export default Link
