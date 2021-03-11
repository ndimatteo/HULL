import React from 'react'

import { centsToPrice } from '../../lib/helpers'

import Drawer from '../drawer'
import CartItem from './item'

import { useSiteContext } from '../../lib/contexts'
import {
  useCartTotals,
  useCartItems,
  useCheckout,
  useToggleCart,
} from '../../lib/contexts/shopify'

const Cart = () => {
  const { isCartOpen, isUpdating } = useSiteContext()
  const { subTotal } = useCartTotals()
  const lineItems = useCartItems()
  const checkoutURL = useCheckout()
  const toggleCart = useToggleCart()

  const goToCheckout = (e) => {
    e.preventDefault()
    toggleCart(false)
    setTimeout(() => {
      window.open(checkoutURL, '_self')
    }, 200)
  }

  return (
    <Drawer title="Your Cart" open={isCartOpen} toggle={toggleCart}>
      {lineItems.length > 0 ? (
        <>
          <CartItems items={lineItems} />
          <div className="cart--footer">
            <div className="cart--subtotal">
              <span>Subtotal</span>
              <span>${centsToPrice(subTotal)}</span>
            </div>

            <a
              href={checkoutURL}
              onClick={(e) => goToCheckout(e)}
              className="btn is-block"
            >
              {isUpdating ? 'Updating...' : 'Checkout'}
            </a>
          </div>
        </>
      ) : (
        <EmptyCart />
      )}
    </Drawer>
  )
}

const CartItems = ({ items }) => {
  return (
    <div className="cart--content">
      <div className="cart--items">
        {items.map((item) => {
          return <CartItem key={item.id} item={item} />
        })}
      </div>
    </div>
  )
}

const EmptyCart = () => (
  <div className="cart--empty">
    <p>Your cart is empty</p>
  </div>
)

export default Cart
