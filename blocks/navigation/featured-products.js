import React from 'react'

import ProductCard from '@blocks/shop/product-card'

const FeaturedProducts = ({ products, onClick }) => {
  if (!products) return null

  return (
    <>
      {products.map((product, key) => (
        <ProductCard
          key={key}
          index={key}
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
