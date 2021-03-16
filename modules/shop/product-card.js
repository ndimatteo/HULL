import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

import {
  ProductGallery,
  ProductThumbnail,
  ProductPrice,
  ProductOption,
} from '@blocks/product'

const itemAnim = {
  initial: {
    opacity: 0,
  },
  show: (i) => ({
    opacity: 1,
    transition: {
      delay: i * 0.1 + 0.5,
      duration: 0.4,
      ease: 'linear',
    },
  }),
  hide: (i) => ({
    opacity: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: 'linear',
    },
  }),
}

const ProductCard = ({ product, index }) => {
  if (!product) return null

  // find default variant for product
  const defaultVariant = product.variants?.find(
    (v) => v.id === product.activeVariant
  )

  // set active variant as default
  const [activeVariant, setActiveVariant] = useState(
    defaultVariant ? defaultVariant : product.variants[0]
  )

  return (
    <motion.div
      initial="initial"
      animate="show"
      exit="hide"
      custom={index}
      variants={itemAnim}
      className="product-card"
    >
      <div className="product-card--visuals">
        {/* Show Gallery */}
        {product.photos.main && product.useGallery === 'true' && (
          <div className="product-card--gallery">
            <ProductGallery
              photosets={product.photos.main}
              activeVariant={activeVariant}
              hasArrows
              hasDots
              hasDrag={false}
            />
          </div>
        )}

        {/* Show Thumbnail */}
        {product.photos.listing && product.useGallery === 'false' && (
          <div className="product-card--thumb">
            <ProductThumbnail
              thumbnails={product.photos.listing}
              activeVariant={activeVariant}
            />
          </div>
        )}
      </div>

      <div className="product-card--details">
        <div className="product-card--header">
          <h2 className="product-card--title">
            <Link
              href={`/products/${
                product.slug +
                (product.surfaceOption ? `?variant=${activeVariant.id}` : '')
              }`}
              scroll={false}
            >
              <a className="product-card--link">{product.title}</a>
            </Link>
          </h2>

          <ProductPrice
            price={activeVariant ? activeVariant.price : product.price}
            comparePrice={
              activeVariant ? activeVariant.comparePrice : product.comparePrice
            }
          />
        </div>

        {product.surfaceOption && (
          <div className="product-card--option">
            {product.options?.map(
              (option, key) =>
                option.position === parseInt(product.surfaceOption) &&
                option.values.length > 1 && (
                  <ProductOption
                    key={key}
                    position={key}
                    option={option}
                    optionSettings={product.optionSettings}
                    variants={product.variants}
                    activeVariant={activeVariant}
                    strictMatch={false}
                    hideLabels
                    onChange={setActiveVariant}
                  />
                )
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ProductCard
