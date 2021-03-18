import React from 'react'
import NextLink from 'next/link'
import cx from 'classnames'

import { getStaticRoute, getDynamicRoute } from '@lib/routes'

import { useProductCount } from '@lib/context'

const Link = ({ link, children, ...rest }) => {
  const isLink = !!link.url
  const isStatic = getStaticRoute(link.page?.type)

  // if a collection, get product count
  const isCollection = ['shopPage', 'collection'].includes(link.page?.type)
  const productCounts = useProductCount()
  const collectionCount = productCounts(
    (isCollection && link.page?.slug) || 'all'
  )

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

    return (
      <NextLink
        href={
          isStatic !== false
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

          {isCollection && (
            <span aria-hidden="true" className="collection-count">
              {collectionCount}
            </span>
          )}
        </a>
      </NextLink>
    )
  }
}

export default Link
