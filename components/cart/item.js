import React from 'react'
import Link from 'next/link'

import { centsToPrice, hasObject } from '../../lib/helpers'

import Photo from '../photo'
import Counter from '../product/counter'

import {
  useUpdateItem,
  useRemoveItem,
  useToggleCart,
} from '../../contexts/shopify-context'

function CartItem({ item }) {
  const removeItem = useRemoveItem()
  const updateItem = useUpdateItem()
  const toggleCart = useToggleCart()

  const changeQuantity = (quantity) => {
    updateItem(item.lineID, quantity)
  }

  const defaultPhoto = item.photos.cart?.find((set) => !set.forOption)
  const variantPhoto = item.photos.cart?.find((set) => {
    const option = set.forOption
      ? {
          name: set.forOption.split(':')[0],
          value: set.forOption.split(':')[1],
        }
      : {}
    return option.value && hasObject(item.options, option)
  })

  const photos = variantPhoto ? variantPhoto : defaultPhoto

  return (
    <div className="cart-item">
      <Photo
        photo={photos?.default}
        srcsetSizes={[400]}
        sizes="(min-width: 768px) 400px, 35vw'"
        aspect="square"
        width="500"
        height="500"
        className="cart-item--photo"
      />
      <div className="cart-item--details">
        <div className="cart-item--header">
          <h2 className="cart-item--title">
            <Link
              href={`/products/${item.product.slug}?variant=${item.id}`}
              scroll={false}
            >
              <a onClick={() => toggleCart(false)} className="cart-item--link">
                {item.product.title}
              </a>
            </Link>
          </h2>
          <div className="cart-item--price">${centsToPrice(item.price)}</div>
        </div>
        <div className="cart-item--variant">{item.title}</div>
        <div className="cart-item--tools">
          <div className="cart-item--quantity">
            <Counter
              key={item.id}
              defaultCount={item.quantity}
              onUpdate={changeQuantity}
            />
          </div>
          <div className="cart-item--remove">
            <button
              onClick={() => removeItem(item.lineID)}
              className="btn is-small"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem
