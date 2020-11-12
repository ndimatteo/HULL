import React, { useState } from 'react'
import { useStore, useAddItem } from '../../contexts/shopify-context'

const addToCart = ({ productID, quantity = 1, className, children }) => {
  const addItemToCart = useAddItem()
  const { isLoading, isAdding } = useStore()

  return (
    <>
      {isLoading ? (
        <button className="btn is-disabled is-block" disabled>
          Loading...
        </button>
      ) : (
        <button
          className={className ? className : null}
          onClick={() => addItemToCart(productID, quantity)}
        >
          {isAdding ? 'Adding...' : <>{children ? children : 'Add to Cart'}</>}
        </button>
      )}
    </>
  )
}

export default addToCart
