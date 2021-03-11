import React from 'react'
import NextLink from 'next/link'

import { getStaticRoute, getDynamicRoute } from '../lib/routes'

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
        className={link.isButton ? 'btn' : null}
        {...rest}
      >
        {link.title || children}
      </a>
    )
    // Internal Page
  } else {
    const isDynamic = getDynamicRoute(link.page?.type)

    return (
      <NextLink
        href={
          isStatic !== false
            ? `/${isStatic}`
            : `/${isDynamic ? `${isDynamic}/` : ''}${link.page?.slug}`
        }
        scroll={false}
      >
        <a className={link.isButton ? 'btn' : null} {...rest}>
          {link.title || children}
        </a>
      </NextLink>
    )
  }
}

export default Link
