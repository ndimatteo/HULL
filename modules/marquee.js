import React from 'react'
import { useInView } from 'react-intersection-observer'

import Marqy from '@components/marqy'
import Photo from '@components/photo'

const Marquee = ({ data = {} }) => {
  const { items, speed, reverse, pausable } = data

  if (!items) return null

  const [marqueeRef, isIntersecting] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div ref={marqueeRef} className="marquee-section">
      <Marqy
        speed={speed}
        direction={reverse ? 'right' : 'left'}
        pauseOnHover={pausable}
        className="marquee"
      >
        <div className="marquee--item">
          {items.map((item, key) => {
            switch (item._type) {
              case 'simple':
                return (
                  <span key={key} className="marquee--text">
                    {item.text}
                  </span>
                )
              case 'photo':
                return (
                  <div key={key} className="marquee--photo">
                    <Photo
                      photo={item.photo}
                      hasPlaceholder={false}
                      forceLoad={isIntersecting}
                    />
                  </div>
                )
            }
          })}
        </div>
      </Marqy>
    </div>
  )
}

export default Marquee
