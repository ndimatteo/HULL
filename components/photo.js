import React, { useRef, useEffect } from 'react'
import LazyLoad from 'vanilla-lazyload'

import { buildSrcSet, buildSrc } from '../lib/helpers'

const Photo = ({ photo, aspect = 0.5625, className }) => {
  const imageRef = useRef()

  let lazy
  useEffect(() => {
    lazy = new LazyLoad(
      {
        threshold: -100,
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
    <figure>
      <div className="is-aspect is-aspect--landscape">
        <picture>
          <source
            data-srcset={buildSrcSet(photo, {
              sizes: [500, 800, 1200],
              aspect: aspect,
              format: photo.type !== 'image/gif' ? 'webp' : null,
            })}
            sizes="(min-width: 928px) 70vw, 100vw"
            type={photo.type !== 'image/gif' ? 'image/webp' : null}
          />

          <img
            ref={imageRef}
            data-srcset={buildSrcSet(photo, {
              sizes: [500, 800, 1200],
              aspect: 0.5625,
            })}
            data-src={buildSrc(photo, {
              width: 800,
              height: 450,
            })}
            sizes="(min-width: 928px) 70vw, 100vw"
            alt={photo.alt}
            className="photo"
          />
        </picture>
      </div>
    </figure>
  )
}

export default Photo
