import React, { useState, useEffect, useRef } from 'react'
import { useIntersection } from 'use-intersection'
import cx from 'classnames'
import { buildSrcSet, buildSrc } from '@/lib/helpers'
import API from '@/lib/shared-types'

interface PhotoProps {
  photo: API['Photo']
  width?: number
  height?: number
  srcSizes?: number[]
  sizes?: string
  layout?: string
  quality?: number
  hasPlaceholder?: boolean
  forceLoad?: boolean
  onLoad?: any
  className?: string
}

const Photo = ({
  photo,
  width,
  height,
  srcSizes = [400, 800, 1000],
  sizes = '(min-width: 940px) 50vw, 100vw',
  layout = 'intrinsic',
  quality = 80,
  hasPlaceholder = true,
  forceLoad,
  onLoad,
  className,
}: PhotoProps) => {
  const imageRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const isIntersecting = useIntersection(imageRef, {
    once: true,
    threshold: 0.1,
  })

  // define our aspect ratio if not a background fill
  const aspect =
    typeof width === 'number' && typeof height === 'number'
      ? (height / width) * 100
      : 100 / (photo.customRatio || photo.aspectRatio)

  const aspectCustom =
    layout === 'intrinsic' ? { paddingTop: `${aspect}%` } : undefined

  // define our src and srcset
  const src =
    buildSrc(photo, {
      ...{ width },
      ...{ height },
      ...{ quality },
    }) ?? undefined

  const srcset = buildSrcSet(photo, {
    ...{ srcSizes },
    ...{ aspect },
    ...{ quality },
  })

  // handle our image onLoad
  function handleLoad() {
    requestAnimationFrame(() => {
      setIsLoaded(true)
    })
  }

  // trigger any onLoad callbacks
  useEffect(() => {
    if (isLoaded && onLoad) onLoad()
  }, [isLoaded])

  if (!photo) return null

  return (
    <figure className={className ? className : undefined}>
      <div
        className={cx('ar', {
          'has-fill': layout === 'fill' || layout === 'contain',
        })}
        style={aspectCustom}
      >
        <picture>
          <img
            ref={imageRef}
            width={width}
            height={height}
            src={forceLoad || isIntersecting ? src : undefined}
            srcSet={forceLoad || isIntersecting ? srcset : undefined}
            sizes={sizes}
            decoding="async"
            onLoad={handleLoad}
            alt={
              photo.alt /* TODO: find out if this exists: || photo.asset?.altText */
            }
            className={cx(getSize(layout), { 'is-loaded': isLoaded })}
          />
        </picture>

        {hasPlaceholder && (
          <div className={cx('ar--placeholder', { 'is-loaded': isLoaded })}>
            <img src={photo.lqip} alt="" role="presentation" />
          </div>
        )}
      </div>
    </figure>
  )
}

const getSize = (layout: string) => {
  switch (layout) {
    case 'intrinsic':
      return 'object-cover'
    case 'fill':
      return 'object-cover'
    case 'contain':
      return 'object-contain'
  }
}

export default Photo
