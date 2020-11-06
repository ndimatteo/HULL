import React, { useState } from 'react'
import Link from 'next/link'

import { centsToPrice, clampRange } from '../../lib/helpers'

import {
  useUpdateItem,
  useRemoveItem,
  useToggleCart,
} from '../../contexts/shopify-context'

const CartItem = ({ id, item }) => {
  const removeItem = useRemoveItem()
  const updateItem = useUpdateItem()
  const toggleCart = useToggleCart()

  const [lineQuantity, setLineQuantity] = useState(item.quantity)

  const updateQuantity = (num) => {
    const cnum = clampRange(num, [1, 10])

    // Bail if no change
    if (cnum === lineQuantity) return

    if (cnum) {
      updateItem(item.lineID, cnum)
    }
    setLineQuantity(cnum)
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
            <div className="counter">
              <button
                onClick={() => updateQuantity(lineQuantity - 1)}
                className="counter--down"
              >
                -
              </button>
              <input
                onChange={(e) =>
                  updateQuantity(parseInt(e.currentTarget.value, 10))
                }
                className="counter--amount"
                type="number"
                inputMode="numeric"
                min="1"
                value={lineQuantity ? lineQuantity : ''}
              />
              <button
                onClick={() => updateQuantity(lineQuantity + 1)}
                className="counter--up"
              >
                +
              </button>
            </div>
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
