import * as React from 'react'
import { AnimatePresence, m } from 'framer-motion'

import { hasObject } from '@/lib/helpers'

import Carousel from '@/components/carousel'
import Photo from '@/components/photo'

import { fadeAnim } from '@/lib/animate'

import type API from '@/lib/shared-types'

type ProductGalleryProps = {
  photosets: API['Product']['photos']['main']
  activeVariant: API['Variant'] | undefined
  hasArrows?: boolean
  hasThumbs?: boolean
  hasDots?: boolean
  hasDrag?: boolean
  hasCounter?: boolean
}

const ProductGallery = ({
  photosets,
  activeVariant,
  hasArrows = false,
  hasThumbs = false,
  hasDots = false,
  hasDrag = false,
  hasCounter = false,
}: ProductGalleryProps) => {
  // 1. extract the active variant's options
  const options = activeVariant?.options

  // 2. find the default photoset from the "forOption" field (default is blank)
  const defaultPhotoset = React.useMemo(
    () => photosets.find((set) => !set.forOption),
    [photosets]
  )

  // 3. find the first photoset that matches one of the variants options
  const variantPhotoset = React.useMemo(
    () =>
      photosets.find((set) => {
        const option = set.forOption
          ? {
              name: set.forOption.split(':')[0],
              value: set.forOption.split(':')[1],
            }
          : {}
        return option.value && hasObject(options, option)
      }),
    [photosets]
  )

  // 4. finally, pick our set of photos
  const photos = variantPhotoset
    ? variantPhotoset?.photos
    : defaultPhotoset?.photos

  // generate a unique ID for this set of images (for framer animation)
  const id = React.useMemo(
    () => photos && photos.map((p) => p.id).join(''),
    [photos]
  )

  if (!photosets || !activeVariant) return null

  return (
    <>
      {photos && (
        <AnimatePresence exitBeforeEnter>
          <m.div
            key={id}
            initial="hide"
            animate="show"
            exit="hide"
            variants={fadeAnim}
          >
            <Carousel
              id={id}
              hasArrows={hasArrows}
              hasDots={hasDots}
              hasCounter={hasCounter}
              hasThumbs={hasThumbs}
              hasDrag={hasDrag}
            >
              {photos.map((photo, key) => (
                <Photo key={key} photo={photo} className="carousel--photo" />
              ))}
            </Carousel>
          </m.div>
        </AnimatePresence>
      )}
    </>
  )
}

export default ProductGallery
