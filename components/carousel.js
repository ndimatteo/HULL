import React, { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { useKeenSlider } from 'keen-slider/react'
import cx from 'classnames'

import { flipAnim } from '@lib/animate'
import Icon from '@components/icon'

const Carousel = ({
  id,
  hasArrows,
  hasDots,
  hasCounter,
  hasThumbs,
  hasDrag = true,
  className,
  children,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [sliderRef, slider] = useKeenSlider({
    initial: 0,
    slides: '.carousel--slide',
    loop: true,
    duration: 800,
    dragSpeed: 0.8,
    controls: hasDrag,
    slideChanged(s) {
      setCurrentSlide(s.details().relativeSlide)
    },
  })

  return (
    <div className={cx('carousel', { 'has-drag': hasDrag }, className)}>
      <div ref={sliderRef} className="carousel--slides">
        {React.Children.map(children, (child, index) => (
          <div className="carousel--slide" key={index}>
            {child}
          </div>
        ))}
      </div>

      {slider && slider.details().size > 1 && (
        <div className="carousel--hud">
          <div className="carousel--nav">
            {hasArrows && (
              <button
                onClick={() => slider.prev()}
                className="carousel--prev"
                aria-label="Previous slide"
              >
                <Icon name="Arrow" id={`prev-${id}`} />
              </button>
            )}

            <div className="carousel--status">
              {hasDots && (
                <div className="carousel--dots">
                  {[...Array(slider.details().size).keys()].map((index) => (
                    <button
                      key={index}
                      onClick={() => slider.moveToSlideRelative(index)}
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
                    <span>{slider.details().size}</span>
                  </div>
                </div>
              )}
            </div>

            {hasArrows && (
              <button
                onClick={() => slider.next()}
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
