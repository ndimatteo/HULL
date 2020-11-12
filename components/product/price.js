import React from 'react'

import { centsToPrice } from '../../lib/helpers'

const ProductPrice = ({ price, comparePrice }) => {
  return (
    <div className="product--price">
      <span className="is-regular">${centsToPrice(price)}</span>
      {!!comparePrice && (
        <span className="is-discounted">${centsToPrice(comparePrice)}</span>
      )}
    </div>
  )
}

export default ProductPrice
