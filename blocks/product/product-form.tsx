import React from 'react'
import { ProductOption } from '@/blocks/product'
import API from '@/lib/shared-types'
import cx from 'classnames'

type ProductForm = {
  product: API['Product']
  activeVariant?: API['Variant']
  onVariantChange: (variant: string) => void
  className?: string
}

const ProductForm = ({
  product,
  activeVariant,
  onVariantChange,
  className,
}: ProductForm) => {
  if (!product?.options?.length) return null

  return (
    <div className={cx('product--options', className)}>
      {product.options?.map(
        (option, key: number) =>
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
