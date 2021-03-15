import React from 'react'

import { centsToPrice } from '../../lib/helpers'

const ProductPrice = ({ price, comparePrice }) => {
  return (
    <div className="price">
      <span className="price--current">${centsToPrice(price)}</span>
      {!!comparePrice && (
        <span className="price--original">${centsToPrice(comparePrice)}</span>
      )}
    </div>
  )
}

export default ProductPrice
