import React from 'react'
import Link from 'next/link'

import { hasObject } from '@lib/helpers'

import Photo from '@components/photo'
import { ProductCounter, ProductPrice } from '@blocks/product'

import { useUpdateItem, useRemoveItem, useToggleCart } from '@lib/context'

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
      {photos && (
        <Photo
          photo={photos?.default}
          srcsetSizes={[400]}
          sizes="(min-width: 768px) 400px, 35vw'"
          className="cart-item--photo"
        />
      )}
      <div className="cart-item--details">
        <div className="cart-item--header">
          <div className="cart-item--title">
            <div className="cart-item--variant">{item.title}</div>
            <h2 className="cart-item--name">
              <Link
                href={`/products/${item.product.slug}?variant=${item.id}`}
                scroll={false}
              >
                <a
                  onClick={() => toggleCart(false)}
                  className="cart-item--link"
                >
                  {item.product.title}
                </a>
              </Link>
            </h2>
          </div>
          <ProductPrice price={item.price} />
        </div>
        <div className="cart-item--tools">
          <div className="cart-item--quantity">
            <ProductCounter
              key={item.id}
              id={item.id}
              defaultCount={item.quantity}
              onUpdate={changeQuantity}
              className="is-small is-inverted"
            />
          </div>
          <button
            onClick={() => removeItem(item.lineID)}
            className="btn is-text"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartItem
