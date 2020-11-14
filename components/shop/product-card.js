import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

import { hasObject } from '../../lib/helpers'

import ProductGallery from '../product/gallery'
import ProductThumbnail from '../product/thumbnail'
import ProductPrice from '../product/price'
import ProductOption from '../product/option'

import Photo from '../photo'
import Marquee from '../marquee'

const itemAnim = {
  initial: {
    opacity: 0,
    y: '.5rem',
  },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05 + 0.5,
      duration: 0.5,
      ease: [0.65, 0, 0.35, 1],
    },
  }),
  hide: (i) => ({
    opacity: 0,
    y: '-.5rem',
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: [0.65, 0, 0.35, 1],
    },
  }),
}

const ProductCard = ({ product, index }) => {
  // find default variant for product
  const defaultVariant = product.variants.find(
    (v) => v.id === product.activeVariant
  )

  // set active variant as default
  const [activeVariant, setActiveVariant] = useState(
    defaultVariant ? defaultVariant : product.variants[0]
  )

  // handle option changes
  const changeOption = (e, name, value) => {
    const newOptions = activeVariant.options.map((opt) =>
      opt.name === name ? { ...opt, value: value } : opt
    )

    const newVariant = product.variants.find((variant) =>
      variant.options.every((opt) => hasObject(newOptions, opt))
    )

    if (newVariant) {
      setActiveVariant(newVariant)
    }
  }

  return (
    <motion.div
      initial="initial"
      animate="show"
      exit="hide"
      custom={index}
      variants={itemAnim}
      className="is-col-12 is-col-sm-6 is-col-lg-4 product-item"
    >
      <div className="product-item--visuals">
        {/* Show Gallery */}
        {product.photos.main && product.useGallery === 'true' && (
          <ProductGallery
            name="product-item"
            photosets={product.photos.main}
            activeVariant={activeVariant}
            hasDots
          />
        )}

        {/* Show Thumbnail */}
        {product.photos.listing && product.useGallery === 'false' && (
          <ProductThumbnail
            thumbnails={product.photos.listing}
            activeVariant={activeVariant}
          />
        )}

        {/* Fallback placeholder */}
        {!product.photos.listing && !product.photos.main && (
          <Photo
            isPlaceholder
            aspect="portrait"
            className="product-item--photo"
          />
        )}

        {product.inStock && product.lowStock && (
          <Marquee line="Low Stock /" className="product-item--status" />
        )}
        {!product.inStock && (
          <Marquee line="Sold Out /" className="product-item--status" />
        )}
      </div>

      <div className="product-item--details">
        <div className="product-item--header">
          <h2 className="product-item--title">
            <Link
              href={`/products/${
                product.slug +
                (product.surfaceOption ? `?variant=${activeVariant.id}` : '')
              }`}
              scroll={false}
            >
              <a className="product-item--link">{product.title}</a>
            </Link>
          </h2>
          <div className="product-item--price">
            <ProductPrice
              price={activeVariant ? activeVariant.price : product.price}
              comparePrice={
                activeVariant
                  ? activeVariant.comparePrice
                  : product.comparePrice
              }
            />
          </div>
        </div>

        {product.surfaceOption && (
          <div className="product-item--option">
            {product.options?.map(
              (option, key) =>
                option.position === parseInt(product.surfaceOption) &&
                option.values.length > 1 && (
                  <ProductOption
                    key={key}
                    position={key}
                    option={option}
                    variants={product.variants}
                    activeVariant={activeVariant}
                    strictMatch={false}
                    hideLabels
                    onChange={changeOption}
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
