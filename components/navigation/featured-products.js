import React from 'react'
import Link from 'next/link'

import { hasObject } from '@lib/helpers'

import ProductThumbnail from '@blocks/product/product-thumbnail'

const FeaturedProducts = ({ products, onClick }) => {
  if (!products) return null

  return (
    <>
      {products.map((product, key) => (
        <FeaturedProductCard key={key} product={product} onClick={onClick} />
      ))}
    </>
  )
}

const FeaturedProductCard = ({ product, onClick }) => {
  // find default variant for product
  const defaultVariant = product.variants?.find((v) => {
    const option = {
      name: product.options[0]?.name,
      value: product.options[0]?.values[0],
      position: product.options[0]?.position,
    }
    return hasObject(v.options, option)
  })

  return (
    <div className="product-featured">
      {product.photos.listing?.length && (
        <div className="product-card--thumb">
          <ProductThumbnail
            thumbnails={product.photos.listing}
            activeVariant={defaultVariant || product.variants[0]}
          />
        </div>
      )}

      <h2 className="product-card--title">
        <Link href={`/products/${product.slug}`} scroll={false}>
          <a className="product-card--link" onClick={onClick}>
            {product.title}
          </a>
        </Link>
      </h2>
    </div>
  )
}

export default FeaturedProducts
