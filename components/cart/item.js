import React, { useState } from 'react'
import Link from 'next/link'

import { centsToPrice } from '../../lib/helpers'

import Counter from '../counter'

import {
  useUpdateItem,
  useRemoveItem,
  useToggleCart,
} from '../../contexts/shopify-context'

const CartItem = ({ id, item }) => {
  const removeItem = useRemoveItem()
  const updateItem = useUpdateItem()
  const toggleCart = useToggleCart()

  const changeQuantity = (quantity) => {
    updateItem(item.lineID, quantity)
  }

  return (
    <div key={id} className="cart-item">
      <figure className="cart-item--photo">
        <div className="is-aspect is-aspect--square"></div>
      </figure>
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
            <Counter defaultCount={item.quantity} onUpdate={changeQuantity} />
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
