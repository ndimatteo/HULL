import React, { useEffect } from 'react'
import LazyLoad from 'vanilla-lazyload'

import { buildSrcSet, buildSrc } from '../lib/helpers'

const Hero = ({ data }) => {
  let lazy
  useEffect(() => {
    lazy = new LazyLoad({
      elements_selector: '.hero--photo img',
      threshold: 0,
      unobserve_entered: true,
      class_loaded: 'is-loaded',
    })

    return () => {
      lazy.destroy()
    }
  }, [])

  const { photo, size = 'landscape', fullscreen } = data

  return (
    <>
      {photo && (
        <div className={`hero${fullscreen ? ' is-fullscreen' : ''}`}>
          <figure className="hero--photo">
            <div className={`is-aspect is-aspect--${size}`}>
              <picture>
                <source
                  data-srcset={buildSrcSet(photo, {
                    sizes: [500, 800, 1200, 1800],
                    // aspect: 0.4,
                    format: photo.type !== 'image/gif' ? 'webp' : null,
                  })}
                  sizes="100vw"
                  type={photo.type !== 'image/gif' ? 'image/webp' : null}
                />
                <img
                  data-srcset={buildSrcSet(photo, {
                    sizes: [500, 800, 1200, 1800],
                    // aspect: 0.4,
                  })}
                  data-src={buildSrc(photo, {
                    width: 1800,
                    // height: 900,
                  })}
                  sizes="100vw"
                  alt={photo.alt}
                  className="photo"
                />
              </picture>
            </div>
          </figure>
        </div>
      )}
    </>
  )
}

export default Hero
