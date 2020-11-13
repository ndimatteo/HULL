import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { hasObject } from '../../lib/helpers'

import Carousel from '../carousel'
import Photo from '../photo'

const galleryAnim = {
  show: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'linear',
      when: 'beforeChildren',
    },
  },
  hide: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'linear',
      when: 'afterChildren',
    },
  },
}

const ProductGallery = ({
  name = 'product',
  photosets,
  activeVariant,
  hasArrows,
  hasThumbs,
  hasDots,
  hasCounter,
}) => {
  const { options } = activeVariant

  const defaultPhotoset = photosets.find((set) => !set.forOption)
  const variantPhotoset = photosets.find((set) => {
    const option = set.forOption
      ? {
          name: set.forOption.split(':')[0],
          value: set.forOption.split(':')[1],
        }
      : {}
    return option.value && hasObject(options, option)
  })

  const photos = variantPhotoset
    ? variantPhotoset.photos
    : defaultPhotoset.photos

  const id = photos.map((p) => p.id).join('')

  return (
    <div className={`${name}--gallery`}>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={id}
          initial="hide"
          animate="show"
          exit="hide"
          variants={galleryAnim}
          className={`${name}--gallery-inner`}
        >
          {photos && (
            <Carousel
              hasArrows={hasArrows}
              hasDots={hasDots}
              hasCounter={hasCounter}
              thumbs={hasThumbs ? photos : false}
            >
              {photos.map((photo, key) => (
                <Photo
                  key={key}
                  photo={photo}
                  srcsetSizes={[500, 800, 1200, 1800]}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  aspect="portrait"
                  width={1200}
                  height={1680}
                  aspectRatio={1.4}
                  className="carousel--photo"
                />
              ))}
            </Carousel>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default ProductGallery
