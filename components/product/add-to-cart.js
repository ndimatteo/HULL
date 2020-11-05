import React, { useState } from 'react'
import { useStore, useAddItem } from '../../contexts/shopify-context'

const addToCart = ({ productID, quantity = 1, className, children }) => {
  const addItemToCart = useAddItem()
  const { isUpdating } = useStore()

  return (
    <button
      className={className ? className : null}
      onClick={() => addItemToCart(productID, quantity)}
    >
      {isUpdating ? 'Adding...' : <>{children ? children : 'Add to Cart'}</>}
    </button>
  )
}

export default addToCart
