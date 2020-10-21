import React, { useRef, useEffect } from 'react'
import BlockContent from '@sanity/block-content-to-react'
import LazyLoad from 'vanilla-lazyload'
import Link from 'next/link'
import dynamic from 'next/dynamic'

import getStaticRoute from '../lib/static-routes'
import { buildSrcSet, buildSrc } from '../lib/helpers'

const Hero = dynamic(() => import('./hero'))
const Text = dynamic(() => import('./text'))
const Events = dynamic(() => import('./events'))
const Accordions = dynamic(() => import('./accordions'))
const FormContact = dynamic(() => import('./form-contact'))
const FormNewsletter = dynamic(() => import('./form-newsletter'))

export const Module = ({ module }) => getModule(module)

const getModule = (module) => {
  const type = module._type
  switch (type) {
    case 'hero':
      return <Hero data={module} />
    case 'textBlock':
      return <Text data={module} />
    case 'eventsList':
      return <Events data={module} />
    case 'accordionList':
      return <Accordions data={module} />
    case 'formContact':
      return <FormContact data={module} />
    case 'formNewsletter':
      return <FormNewsletter data={module} />
    default:
      return null
  }
}

export const serializers = {
  types: {
    block: (props) => {
      const { style = 'normal' } = props.node

      if (style === 'statement') {
        return <p className="is-statement">{props.children}</p>
      } else if (style === 'note') {
        return <p className="is-note">{props.children}</p>
      } else if (style === 'important') {
        return <p className="is-important">{props.children}</p>
      }

      return BlockContent.defaultSerializers.types.block(props)
    },
    figure: ({ node }) => {
      const imageRef = useRef()

      let lazy
      useEffect(() => {
        lazy = new LazyLoad(
          {
            threshold: 0,
            unobserve_entered: true,
            class_loaded: 'is-loaded',
          },
          [imageRef.current]
        )

        return () => {
          lazy.destroy()
        }
      }, [imageRef])

      return (
        <figure className="rc-image">
          <div
            className="is-aspect is-aspect--custom"
            style={{ paddingTop: 100 / node.aspectRatio + '%' }}
          >
            <picture>
              <source
                data-srcset={buildSrcSet(node, {
                  sizes: [500, 800, 1200, 1800],
                  format: node.type !== 'image/gif' ? 'webp' : null,
                })}
                sizes="100vw"
                type={node.type !== 'image/gif' ? 'image/webp' : null}
              />

              <img
                ref={imageRef}
                data-srcset={buildSrcSet(node, {
                  sizes: [500, 800, 1200, 1800],
                })}
                data-src={buildSrc(node, {
                  width: 1800,
                })}
                sizes="100vw"
                alt={node.alt}
                className="photo"
              />
            </picture>
          </div>
        </figure>
      )
    },
    horizontalRule: () => <hr />,
  },
  marks: {
    highlight: ({ mark, children }) => {
      const { color } = mark
      return <span className={color}>{children}</span>
    },

    link: ({ mark, children }) => {
      const { type, href, slug } = mark

      const isLink = !!href
      const isStatic = getStaticRoute(type ? type : '')

      return isLink ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <Link
          href={isStatic || isStatic === '' ? `/${isStatic}` : `/[...slug]`}
          as={!isStatic && isStatic !== '' ? `/${slug?.current}` : null}
          scroll={false}
        >
          <a>{children}</a>
        </Link>
      )
    },

    button: ({ mark, children }) => {
      const { color, type, href, slug } = mark

      const isLink = !!href
      const isStatic = getStaticRoute(type ? type : '')

      return isLink ? (
        <a
          className={`btn ${color}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ) : (
        <Link
          href={isStatic || isStatic === '' ? `/${isStatic}` : `/[...slug]`}
          as={!isStatic && isStatic !== '' ? `/${slug?.current}` : null}
          scroll={false}
        >
          <a className={`btn ${color}`}>{children}</a>
        </Link>
      )
    },
  },
}
