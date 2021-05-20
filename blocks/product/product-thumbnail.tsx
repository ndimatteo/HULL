import React from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { hasObject } from '@/lib/helpers'
import Photo from '@/components/photo'
import API from '@/lib/shared-types'

const thumbAnim = {
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

type ProductThumbnailProps = {
  thumbnails: API['Product']['photos']['listing']
  activeVariant?: API['Variant']
}

const ProductThumbnail = ({
  thumbnails = [],
  activeVariant,
}: ProductThumbnailProps) => {
  const options = activeVariant?.options

  const defaultThumbnails = thumbnails.find((set) => !set.forOption)
  const variantThumbnails = thumbnails.find((set) => {
    const option = set.forOption
      ? {
          name: set.forOption.split(':')[0],
          value: set.forOption.split(':')[1],
        }
      : {}
    return option.value && hasObject(options, option)
  })

  const photos = variantThumbnails ? variantThumbnails : defaultThumbnails

  if (!photos?.default) return null

  const id = photos.default.id + (photos.hover?.id ?? 0)

  return (
    <AnimatePresence exitBeforeEnter>
      <m.div
        key={id}
        initial="hide"
        animate="show"
        exit="hide"
        variants={thumbAnim}
        className="product-card--photo"
      >
        <Photo
          photo={photos?.default}
          srcSizes={[400, 800, 1000]}
          sizes="(min-width: 1200px) 33vw, (min-width: 768px) 50vw, 100vw"
          width={1200}
          className="is-defualt"
        />

        {photos?.hover && (
          <Photo
            photo={photos.hover}
            srcSizes={[400, 800, 1000]}
            sizes="(min-width: 1200px) 33vw, (min-width: 768px) 50vw, 100vw"
            width={1200}
            className="is-hover"
          />
        )}
      </m.div>
    </AnimatePresence>
  )
}

export default ProductThumbnail
