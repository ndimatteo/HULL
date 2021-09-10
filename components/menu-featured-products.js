import React from 'react'

import ProductCard from '@components/product-card'

const FeaturedProducts = ({ products, onClick }) => {
  if (!products) return null

  return (
    <>
      {products.map((product, key) => (
        <ProductCard
          key={key}
          product={product}
          hasVisuals={product.photos.main || product.photos.listing}
          showThumbs={product.photos.listing}
          className="is-featured"
          onClick={onClick}
        />
      ))}
    </>
  )
}

export default FeaturedProducts
