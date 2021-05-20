import * as React from 'react'
import { m } from 'framer-motion'
import Link from 'next/link'
import cx from 'classnames'
import { hasObject } from '@/lib/helpers'
import {
  ProductGallery,
  ProductThumbnail,
  ProductPrice,
  ProductOption,
} from '@/blocks/product'
import type API from '@/lib/shared-types'

const itemAnim = {
  initial: {
    opacity: 0,
  },
  show: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.05 + 0.4,
      duration: 0.3,
      ease: 'linear',
    },
  }),
  hide: (i: number) => ({
    opacity: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: 'linear',
    },
  }),
}

interface ProductCardTypes {
  product?: API['Product']
  index?: number
  hasVisuals?: boolean
  showGallery?: boolean
  showThumbs?: boolean
  showPrice?: boolean
  showOption?: boolean
  style?: string
  onClick?: API['OnClick']
  className?: string
}

const ProductCard = ({
  product,
  index,
  hasVisuals,
  showGallery,
  showThumbs,
  showPrice,
  showOption,
  style,
  onClick,
}: ProductCardTypes) => {
  const variants = product?.variants
  const options = product?.options

  // find default variant for product
  const defaultVariant = React.useMemo(
    () =>
      variants?.find((v) => {
        const option = {
          name: options?.[0]?.name,
          value: options?.[0]?.values?.[0],
          position: options?.[0]?.position,
        }
        return hasObject(v.options, option)
      }),
    [variants, options]
  )

  // set active variant as default
  const [activeVariant, setActiveVariant] = React.useState<
    API['Variant'] | undefined
  >(defaultVariant ? defaultVariant : variants?.[0])

  // assign the new variant when options are changed
  const onChangeActiveVariant = React.useCallback(
    (id: string) => {
      const newActiveVariant = variants?.find((v) => v.id === id)
      setActiveVariant(newActiveVariant)
    },
    [variants, setActiveVariant]
  )

  if (!product) return null

  return (
    <m.div
      initial="initial"
      animate="show"
      exit="hide"
      custom={index}
      variants={itemAnim}
      className={cx('product-card', style)}
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
        </div>
      )}

      <div className="product-card--details">
        <div className="product-card--header">
          <h3 className="product-card--title">
            <Link
              href={`/products/${
                product.slug +
                (product.surfaceOption ? `?variant=${activeVariant?.id}` : '')
              }`}
              scroll={false}
            >
              <a className="product-card--link" onClick={onClick}>
                {product.title}
              </a>
            </Link>
          </h3>

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
                    onChange={onChangeActiveVariant}
                  />
                )
            )}
          </div>
        )}
      </div>
    </m.div>
  )
}

export default ProductCard
