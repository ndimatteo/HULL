import React, { useRef } from 'react'
import { useIntersection } from 'use-intersection'
import { Marqy } from 'marqy'
import Photo from '@/components/photo'
import ProductCard from '@/blocks/shop/product-card'
import type API from '@/lib/shared-types'

type MarqueeProps = {
  data: API['Marquee']
}

const Marquee = ({ data }: MarqueeProps) => {
  const { items, speed, reverse, pausable } = data

  const marqueeRef = useRef<HTMLDivElement | null>(null)
  const isIntersecting = useIntersection(marqueeRef, {
    // triggerOnce: true,
    threshold: 0.1,
  })

  if (!items?.length) return null

  return (
    <div ref={marqueeRef} className="marquee-section">
      <Marqy
        speed={speed ?? 0.5}
        direction={reverse ? 'right' : 'left'}
        pauseOnHover={pausable}
        // @ts-expect-error - classname is passed in
        className="marquee"
      >
        <div className="marquee--item">
          {items.map((item: any, key: number) => {
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
                  <div key={key} className="marquee--product">
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
