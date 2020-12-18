import React, { useState, useEffect, useCallback } from 'react'
import { useEmblaCarousel } from 'embla-carousel/react'
import { motion, AnimatePresence } from 'framer-motion'

import Photo from './photo'

const Carousel = ({
  children,
  thumbs,
  hasArrows,
  hasDots,
  hasCounter,
  className,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    speed: 13,
    loop: true,
    containScroll: 'keepSnaps',
    align: 0,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState([])

  const scrollTo = useCallback((index) => emblaApi.scrollTo(index), [emblaApi])

  const onSelect = useCallback(() => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (emblaApi) {
      setScrollSnaps(emblaApi.scrollSnapList())
      emblaApi.on('select', onSelect)
      onSelect()
    }
  }, [emblaApi])

  const flipAnim = {
    show: {
      y: ['100%', '0%'],
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
        when: 'beforeChildren',
      },
    },
    hide: {
      y: '-100%',
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
        when: 'afterChildren',
      },
    },
  }

  return (
    <div
      ref={emblaRef}
      className={`carousel${className ? ` ${className}` : ''}`}
    >
      <div className="carousel--container">
        {children.map((child, index) => (
          <div className="carousel--slide" key={index}>
            {child}
          </div>
        ))}
      </div>

      {scrollSnaps && thumbs && (
        <div className="carousel--thumbs">
          {thumbs.map((thumb, key) => (
            <button
              key={key}
              onClick={() => scrollTo(key)}
              aria-label={`Go to slide ${key + 1}`}
              className={`carousel--thumb${
                selectedIndex === key ? ' is-active' : ''
              }`}
            >
              <Photo
                photo={thumb}
                srcsetSizes={[400]}
                sizes="(min-width: 768px) 400px, 35vw'"
                aspect="square"
                width="500"
                height="500"
              />
            </button>
          ))}
        </div>
      )}

      {scrollSnaps && (
        <div className="carousel--hud">
          {hasArrows && (
            <div className="carousel--nav">
              <button
                onClick={() => emblaApi.scrollPrev()}
                className="carousel--prev"
                aria-label="Previous slide"
              >
                ←
              </button>
              <button
                onClick={() => emblaApi.scrollNext()}
                className="carousel--next"
                aria-label="Next slide"
              >
                →
              </button>
            </div>
          )}

          {hasDots && (
            <div className="carousel--dots">
              {scrollSnaps.map((dot, key) => (
                <button
                  key={key}
                  onClick={() => scrollTo(key)}
                  aria-label={`Go to slide ${key + 1}`}
                  className={selectedIndex === key ? 'is-active' : null}
                />
              ))}
            </div>
          )}

          {hasCounter && (
            <div className="carousel--status">
              <div className="carousel--counter is-current">
                <AnimatePresence initial={false}>
                  <motion.span
                    key={selectedIndex + 1}
                    initial="hide"
                    animate="show"
                    exit="hide"
                    variants={flipAnim}
                  >
                    {selectedIndex + 1}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="carousel--progress">
                <span
                  style={{
                    transform: `scaleX(${
                      selectedIndex / (scrollSnaps.length - 1)
                    })`,
                  }}
                />
              </div>

              <div className="carousel--counter is-total">
                <span>{scrollSnaps.length}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Carousel
