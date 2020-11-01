import React, { useState, useContext } from 'react'
import Drawer from './drawer'

import { ShopifyContext } from '../contexts/ShopifyContext'
import { Context } from '../contexts/MainContext'

const Cart = ({}) => {
  const [showDrawer, setShowDrawer] = useState(false)

  const {
    store: { isCartOpen },
    setIsCartOpen,
  } = useContext(Context)

  const {
    checkout: { lineItems },
    updateItemQuantity,
    removeItemFromCart,
  } = useContext(ShopifyContext)

  const cartItems = lineItems?.map((i, idx) => {
    const { variant } = i
    return (
      <div key={idx} className="cart--content">
        <div className="cart--content-product-info">
          <div>{`product: ${variant.product.handle}`}</div>
          <div>{`variant: ${variant.title}`}</div>
          <div>{`price: ${variant.price}`}</div>
        </div>
        <div>
          <div className="cart--content-quantity-selectors">
            <div className="decrement">-</div>
            <div className="increment">+</div>
          </div>
          <div
            className="cart--content-remove"
            onClick={() => removeItemFromCart(i.id)}
          >
            remove
          </div>
        </div>
      </div>
    )
  })

  const emptyCart = (
    <div className="cart--is-empty">
      <p>Cart is empty, nerd</p>
    </div>
  )

  return (
    <Drawer
      title="Cart"
      id="cart"
      className="cart"
      open={isCartOpen}
      toggle={setIsCartOpen}
    >
      {lineItems?.length > 0 ? cartItems : emptyCart}
    </Drawer>
  )
}

export default Cart
