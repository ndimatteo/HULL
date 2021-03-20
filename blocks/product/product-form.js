import React from 'react'

import { ProductOption } from '@blocks/product'

const ProductForm = ({ product, activeVariant, onVariantChange }) => {
  if (!product?.options?.length) return null

  return (
    <div className="product--options">
      {product.options?.map(
        (option, key) =>
          option.values?.length && (
            <ProductOption
              key={key}
              position={key}
              option={option}
              optionSettings={product.optionSettings}
              variants={product.variants}
              activeVariant={activeVariant}
              onChange={onVariantChange}
            />
          )
      )}
    </div>
  )
}

export default ProductForm
