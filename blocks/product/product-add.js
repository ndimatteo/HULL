import React from 'react'

import { useSiteContext } from '@lib/contexts'
import { useAddItem } from '@lib/contexts/shopify'

const ProductAdd = ({ productID, quantity = 1, className, children }) => {
  const addItemToCart = useAddItem()
  const { isLoading, isAdding } = useSiteContext()

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

export default ProductAdd
