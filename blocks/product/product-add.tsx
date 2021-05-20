import * as React from 'react'
import cx from 'classnames'

import { useSiteContext, useAddItem } from '@/lib/context'

type ProductAddProps = {
  productID: string
  quantity: number
  className: string
  children: React.ReactChild
}

const ProductAdd = ({
  productID,
  quantity = 1,
  className,
  children,
}: ProductAddProps) => {
  const addItemToCart = useAddItem()
  const { shopifyClient, isLoading, isAdding } = useSiteContext()

  // Check that Shopify is connected
  if (!shopifyClient) {
    return <span className={cx('is-disabled', className)}>Unavailable</span>
  }

  return (
    <>
      {isLoading ? (
        <button className={cx('is-disabled', className)} disabled>
          Loading...
        </button>
      ) : (
        <button
          className={cx(className, { 'is-disabled': isAdding })}
          onClick={() => addItemToCart(productID, quantity)}
        >
          {isAdding ? 'Adding...' : <>{children ? children : 'Add to Cart'}</>}
        </button>
      )}
    </>
  )
}

export default ProductAdd
