import React from 'react'
import Link from 'next/link'

import ProductThumbnail from '@blocks/product/product-thumbnail'

const FeaturedProducts = ({ products, onClick }) => {
  if (!products) return null

  return (
    <>
      {products.map((product, key) => (
        <div key={key} className="product-featured">
          {product.photos.listing && (
            <div className="product-card--thumb">
              <ProductThumbnail
                thumbnails={product.photos.listing}
                activeVariant={product.activeVariant}
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
      ))}
    </>
  )
}

export default FeaturedProducts
