import React, { useRef, useEffect } from 'react'
import LazyLoad from 'vanilla-lazyload'

import { buildSrcSet, buildSrc } from '../lib/helpers'

const Photo = ({
  photo,
  srcsetSizes = [500, 800, 1200],
  sizes = '(min-width: 928px) 70vw, 100vw',
  aspect = 'custom',
  aspectCustom,
  aspectRatio,
  width,
  height,
  className,
  style,
}) => {
  const imageRef = useRef()

  let lazy
  useEffect(() => {
    if (photo) {
      lazy = new LazyLoad(
        {
          threshold: -100,
          unobserve_entered: true,
          class_loaded: 'is-loaded',
        },
        [imageRef.current]
      )
    }

    return () => {
      if (photo) lazy.destroy()
    }
  }, [imageRef])

  return (
    <figure className={className ? className : null}>
      <div className={`is-aspect is-aspect--${aspect}`} style={aspectCustom}>
        {photo && (
          <picture>
            <source
              data-srcset={buildSrcSet(photo, {
                sizes: srcsetSizes,
                aspect: aspectRatio,
                format: photo.type !== 'image/gif' ? 'webp' : null,
              })}
              sizes={sizes}
              type={photo.type !== 'image/gif' ? 'image/webp' : null}
            />

            <img
              ref={imageRef}
              data-srcset={buildSrcSet(photo, {
                sizes: srcsetSizes,
                aspect: aspectRatio,
              })}
              data-src={buildSrc(photo, {
                width: width,
                height: height,
              })}
              sizes={sizes}
              alt={photo.alt}
              className="photo"
            />
          </picture>
        )}
      </div>
    </figure>
  )
}

export default Photo
