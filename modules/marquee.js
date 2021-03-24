import React, { useRef } from 'react'
import { useIntersection } from 'use-intersection'
import { Marqy } from 'marqy'

import Photo from '@components/photo'
import ProductCard from '@blocks/shop/product-card'

const Marquee = ({ data = {} }) => {
  const { items, speed, reverse, pausable } = data

  if (!items?.length) return null

  const marqueeRef = useRef()
  const isIntersecting = useIntersection(marqueeRef, {
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
                  <div
                    key={key}
                    className="marquee--photo"
                    style={{ flex: item.photo.aspectRatio }}
                  >
                    <Photo
                      photo={item.photo}
                      hasPlaceholder={false}
                      forceLoad={isIntersecting}
                    />
                  </div>
                )
              case 'product':
                return (
                  <div className="marquee--product">
                    <ProductCard
                      key={key}
                      product={item.product}
                      hasVisuals
                      showThumbs
                      showPrice
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
