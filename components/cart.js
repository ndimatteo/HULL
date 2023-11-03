import cx from 'classnames'
import FocusTrap from 'focus-trap-react'
import { m } from 'framer-motion'
import { useEffect, useState } from 'react'

import { centsToPrice } from '@lib/helpers'

import {
  useCartCount,
  useCartItems,
  useCartTotals,
  useCheckout,
  useCheckoutCount,
  useCheckoutItems,
  useCheckoutTotals,
  useSiteContext,
  useToggleCart,
} from '@lib/context'

import CartItem from '@components/cart-item'

const Cart = ({ data }) => {
  const { shop } = data

  if (!shop) return null

  const { isCartOpen, isUpdating } = useSiteContext()
  const { subTotal } = useCartTotals()
  const { subTotalCheckout } = useCheckoutTotals()
  const checkouttCount = useCheckoutCount()
  const cartCount = useCartCount()
  const lineItems = useCheckoutItems()
  const cartLineItems = useCartItems()
  const checkoutURL = useCheckout()
  const toggleCart = useToggleCart()

  const [hasFocus, setHasFocus] = useState(false)
  const [checkoutLink, setCheckoutLink] = useState(checkoutURL)

  const handleKeyDown = (e) => {
    if (e.which === 27) {
      toggleCart(false)
    }
  }

  const goToCheckout = (e) => {
    e.preventDefault()
    toggleCart(false)

    setTimeout(() => {
      window.open(checkoutLink, '_self')
    }, 200)
  }

  // update our checkout URL to use our custom domain name
  useEffect(() => {
    if (checkoutURL) {
      const buildCheckoutLink = shop.storeURL
        ? checkoutURL.replace(
            /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/g,
            shop.storeURL,
          )
        : checkoutURL
      setCheckoutLink(buildCheckoutLink)
    }
  }, [checkoutURL])

  return (
    <>
      <FocusTrap
        active={isCartOpen && hasFocus}
        focusTrapOptions={{ allowOutsideClick: true }}
      >
        <m.div
          initial="hide"
          animate={isCartOpen ? 'show' : 'hide'}
          variants={{
            show: {
              x: '0%',
            },
            hide: {
              x: '100%',
            },
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onKeyDown={(e) => handleKeyDown(e)}
          onAnimationComplete={(v) => setHasFocus(v === 'show')}
          className={cx('cart is-inverted', {
            'is-active': isCartOpen,
            'is-updating': isUpdating,
          })}
        >
          <div className="cart--inner">
            <div className="cart--header">
              <div className="cart--title">
                Votre panier <span className="cart--count">{cartCount}</span>
              </div>
              <button className="cart-toggle" onClick={() => toggleCart(false)}>
                Fini
              </button>
            </div>

            <div className="cart--content">
              {cartLineItems?.length ? (
                <CartItems items={cartLineItems} />
              ) : (
                <EmptyCart />
              )}
            </div>

            {cartLineItems?.length > 0 && (
              <div className="cart--footer">
                <div className="cart--subtotal">
                  <span>Subtotal</span>
                  <span>{centsToPrice(subTotal * 100)}$</span>
                </div>

                <a
                  href={checkoutLink}
                  onClick={(e) => goToCheckout(e)}
                  className="btn is-primary is-inverted is-large is-block"
                >
                  {isUpdating ? 'Updating...' : 'Checkout'}
                </a>

                {shop.cartMessage && (
                  <p className="cart--message">{shop.cartMessage}</p>
                )}
              </div>
            )}
          </div>
        </m.div>
      </FocusTrap>

      <div
        className={cx('cart--backdrop', {
          'is-active': isCartOpen,
        })}
        onClick={() => toggleCart(false)}
      />
    </>
  )
}

const CartItems = ({ items }) => {
  return (
    <div className="cart--items">
      {items.map((item) => {
        return <CartItem key={item.node.id} item={item.node} />
      })}
    </div>
  )
}

const EmptyCart = () => (
  <div className="cart--empty">
    <p>Your cart is empty</p>
  </div>
)

export default Cart
