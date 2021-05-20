import React from 'react'

import { centsToPrice } from '@/lib/helpers'

type ProductPriceProps = {
  price: number
  comparePrice?: number
}

const ProductPrice = ({ price, comparePrice }: ProductPriceProps) => {
  return (
    <div className="price">
      <span className="price--current">${centsToPrice(price)}</span>

      {!!comparePrice && (
        <span className="price--discount">
          {Math.ceil(((comparePrice - price) / comparePrice) * 100)}% off
        </span>
      )}
    </div>
  )
}

export default ProductPrice
