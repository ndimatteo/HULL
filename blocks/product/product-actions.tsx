import React, { useState } from 'react'
import { ProductCounter, ProductAdd, ProductWaitlist } from '@/blocks/product'
import API from '@/lib/shared-types'

type ProductActionsProps = {
  activeVariant?: API['Variant']
  klaviyoAccountID?: string
}

const ProductActions = ({
  activeVariant,
  klaviyoAccountID,
}: ProductActionsProps) => {
  // set default quantity
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="product--actions">
      {activeVariant?.inStock ? (
        <>
          <ProductCounter
            id={activeVariant.id}
            max={10}
            onUpdate={setQuantity}
          />
          <ProductAdd
            productID={activeVariant.id}
            quantity={quantity}
            className="btn is-primary is-large is-block"
          >
            Add To Cart
          </ProductAdd>
        </>
      ) : (
        <>
          {klaviyoAccountID ? (
            <ProductWaitlist
              variant={activeVariant?.id}
              klaviyoAccountID={klaviyoAccountID}
            />
          ) : (
            <div className="btn is-large is-disabled is-block">
              Out of Stock
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ProductActions
