import React from 'react'
import ProductCard from '@/blocks/shop/product-card'
import type API from '@/lib/shared-types'

type FeaturedProductsProps = {
  products: API['Product'][]
  onClick: API['OnClick']
}

const FeaturedProducts = ({ products, onClick }: FeaturedProductsProps) => {
  if (!products) return null

  return (
    <>
      {products.map((product, key) => (
        <ProductCard
          key={key}
          index={key}
          product={product}
          hasVisuals={!!(product.photos.main || product.photos.listing)}
          showThumbs={!!product.photos.listing}
          style="is-featured"
          onClick={onClick}
        />
      ))}
    </>
  )
}

export default FeaturedProducts
