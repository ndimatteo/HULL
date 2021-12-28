import React, { useState } from 'react'
import { m } from 'framer-motion'
import Link from 'next/link'
import cx from 'classnames'

import { hasObject } from '@lib/helpers'

import {
  ProductGallery,
  ProductThumbnail,
  ProductPrice,
  ProductOption,
  ProductAdd,
} from '@components/product'

const itemAnim = {
  show: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'linear',
    },
  },
  hide: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'linear',
    },
  },
}

const ProductCard = React.forwardRef(
  (
    {
      product,
      hasVisuals,
      showGallery,
      showThumbs,
      showPrice,
      showOption,
      showQuickAdd,
      activeFilters,
      className,
      onClick,
    },
    ref
  ) => {
    if (!product) return null

    const activeFilterValues =
      activeFilters?.flatMap((f) =>
        f.values.map((v) => ({
          name: f.name,
          value: v,
        }))
      ) || []

    // select the default variant based current active filters
    const defaultOption = activeFilterValues
      .map((filter) => {
        const currentFilter = product.filters.find(
          (f) => f.slug === filter.value && f.forOption
        )

        if (!currentFilter) return null

        const option = currentFilter.forOption.split(':')
        const { 0: optionName, 1: optionValue } = option

        return {
          name: optionName,
          value: optionValue,
        }
      })
      .filter(Boolean)

    // find default variant for product
    const defaultVariant = product.variants?.find((v) => {
      const currentOption = defaultOption?.length
        ? defaultOption[defaultOption.length - 1]
        : {
            name: product.options[0]?.name,
            value: product.options[0]?.values[0],
          }

      return hasObject(v.options, currentOption)
    })

    // set active variant as default
    const [activeVariant, setActiveVariant] = useState(
      defaultVariant ? defaultVariant : product.variants[0]
    )

    // assign the new variant when options are changed
    const changeActiveVariant = (id) => {
      const newActiveVariant = product.variants.find((v) => v.id === id)
      setActiveVariant(newActiveVariant)
    }

    return (
      <m.div
        ref={ref}
        variants={itemAnim}
        className={cx('product-card', className)}
      >
        {hasVisuals && (
          <div className="product-card--visuals">
            {/* Show Gallery */}
            {showGallery && (
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
            {showThumbs && (
              <div className="product-card--thumb">
                <ProductThumbnail
                  thumbnails={product.photos.listing}
                  activeVariant={activeVariant}
                />
              </div>
            )}

            {/* Quick Add */}
            {showQuickAdd && activeVariant.inStock && (
              <div className="product-card--add is-inverted">
                <ProductAdd
                  productID={activeVariant.id}
                  className="btn is-white is-large"
                />
              </div>
            )}
          </div>
        )}

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
                <a className="product-card--link" onClick={onClick}>
                  {product.title}
                </a>
              </Link>
            </h2>

            {showPrice && (
              <ProductPrice
                price={activeVariant ? activeVariant.price : product.price}
                comparePrice={
                  activeVariant
                    ? activeVariant.comparePrice
                    : product.comparePrice
                }
              />
            )}
          </div>

          {/* Surfaced Option */}
          {showOption && (
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
                      onChange={changeActiveVariant}
                    />
                  )
              )}
            </div>
          )}
        </div>
      </m.div>
    )
  }
)

export default ProductCard
