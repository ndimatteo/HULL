import React, { useState, useCallback, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import cx from 'classnames'

import { flipAnim } from '@lib/animate'

import Icon from '@components/icon'

const Carousel = ({
  id,
  hasArrows,
  hasDots,
  hasCounter,
  hasDrag = true,
  className,
  children,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState([])

  const [sliderRef, slider] = useEmblaCarousel({
    loop: true,
    draggable: hasDrag,
  })

  const scrollPrev = useCallback(() => slider?.scrollPrev(), [slider])
  const scrollNext = useCallback(() => slider?.scrollNext(), [slider])
  const scrollTo = useCallback((index) => slider?.scrollTo(index), [slider])

  const onSelect = useCallback(() => {
    setCurrentSlide(slider.selectedScrollSnap())
  }, [slider])

  useEffect(() => {
    if (slider) {
      setScrollSnaps(slider.scrollSnapList())
      slider.on('select', onSelect)
      onSelect()
    }
  }, [slider])

  return (
    <div className={cx('carousel', { 'has-drag': hasDrag }, className)}>
      <div ref={sliderRef} className="carousel--container">
        <div className="carousel--slides">
          {React.Children.map(children, (child, index) => (
            <div className="carousel--slide" key={index}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {slider && scrollSnaps.length > 1 && (
        <div className="carousel--hud">
          <div className="carousel--nav">
            {hasArrows && (
              <button
                onClick={scrollPrev}
                className="carousel--prev"
                aria-label="Previous slide"
              >
                <Icon name="Arrow" id={`prev-${id}`} />
              </button>
            )}

            <div className="carousel--status">
              {hasDots && (
                <div className="carousel--dots">
                  {scrollSnaps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => scrollTo(index)}
                      aria-label={`Go to slide ${index + 1}`}
                      className={cx('carousel--dot', {
                        'is-active': currentSlide === index,
                      })}
                    />
                  ))}
                </div>
              )}

              {hasCounter && (
                <div className="carousel--counter">
                  <div className="carousel--counter-item is-current">
                    <div className="counter-flipper">
                      <AnimatePresence initial={false}>
                        <m.span
                          key={currentSlide + 1}
                          initial="hide"
                          animate="show"
                          exit="hide"
                          variants={flipAnim}
                        >
                          {currentSlide + 1}
                        </m.span>
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="carousel--counter-item is-total">
                    <span>{scrollSnaps.length}</span>
                  </div>
                </div>
              )}
            </div>

            {hasArrows && (
              <button
                onClick={scrollNext}
                className="carousel--next"
                aria-label="Next slide"
              >
                <Icon name="Arrow" id={`next-${id}`} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Carousel
