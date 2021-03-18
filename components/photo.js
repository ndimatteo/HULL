import React, { useRef, useState, useEffect } from 'react'
import LazyLoad from 'vanilla-lazyload'
import cx from 'classnames'

import { buildSrcSet, buildSrc } from '@lib/helpers'

const Photo = ({
  photo,
  width,
  height,
  srcSizes = [300, 600, 1200],
  sizes = '(min-width: 940px) 50vw, 100vw',
  layout = 'intrinsic',
  quality = 80,
  hasPlaceholder = true,
  onLoad,
  className,
}) => {
  const imageRef = useRef()
  const [loaded, setLoaded] = useState(false)

  // setup lazyload
  useEffect(() => {
    let lazy
    if (photo && imageRef.current) {
      lazy = new LazyLoad(
        {
          threshold: -150,
          callback_loaded: () => setLoaded(true),
        },
        [imageRef.current]
      )
    }

    return () => {
      lazy && lazy.destroy()
    }
  }, [photo, imageRef])

  useEffect(() => {
    if (loaded && onLoad) onLoad()
  }, [loaded])

  // define our aspect ratio if not a background fill
  const aspect =
    typeof width === 'number' && typeof height === 'number'
      ? (height / width) * 100
      : 100 / (photo.customRatio || photo.aspectRatio)

  const aspectCustom =
    layout === 'intrinsic' ? { paddingTop: `${aspect}%` } : null

  return (
    <figure className={className ? className : null}>
      <div
        className={cx('ar', {
          'has-fill': layout === 'fill' || layout === 'contain',
        })}
        style={aspectCustom}
      >
        {photo && (
          <picture>
            <img
              ref={imageRef}
              width={width}
              height={height}
              data-src={buildSrc(photo, {
                ...{ width },
                ...{ height },
                ...{ quality },
              })}
              data-srcset={buildSrcSet(photo, {
                ...{ srcSizes },
                ...{ aspect },
                ...{ quality },
              })}
              sizes={sizes}
              decoding="async"
              alt={photo.alt || photo.asset?.altText}
              className={cx(getSize(layout), { 'is-loaded': loaded })}
            />
          </picture>
        )}

        {photo && hasPlaceholder && (
          <div className={cx('ar--placeholder', { 'is-loaded': loaded })}>
            <img src={photo.lqip} alt="" role="presentation" />
          </div>
        )}
      </div>
    </figure>
  )
}

const getSize = (layout) => {
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
