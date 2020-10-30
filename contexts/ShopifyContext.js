import React, { createContext, useReducer, useEffect } from 'react'
import useLocalStorage from 'react-use/lib/useLocalStorage'
import shopify from '../lib/shopify'
import { unique } from '../lib/helpers'

export const ShopifyContext = createContext()

const persistedStateId = 'satans_checkout'

const shopifyActions = {
  addItemToCart: 'add_item_to_cart',
  setLoading: 'set_loading',
  setCheckout: 'set_checkout',
}

function shopifyCheckoutReducer(state, action) {
  switch (action.type) {
    case shopifyActions.addItemToCart:
      return {
        ...state,
        products: [
          {
            variantId: action.payload.variantId,
            quantity: action.payload.quantity,
          },
        ],
      }

    case shopifyActions.setLoading:
      return { ...state, loaded: false }

    case shopifyActions.setCheckout:
      const { lineItems = [], subtotalPrice = 0, webUrl = '' } = action.payload
      const count = lineItems
        .map((i) => i.customAttributes[0].value)
        .filter(unique).length

      return {
        ...state,
        itemCount: count,
        lineItems,
        subtotalPrice,
        webUrl,
        loaded: true,
      }

    default:
      throw new Error(`Action of type ${action.type} does not exist.`)
  }
}

const ShopifyProvider = ({ children }) => {
  const [shopifyCheckoutId, setShopifyCheckoutId] = useLocalStorage(
    persistedStateId,
    ''
  )

  const [checkout, dispatch] = useReducer(shopifyCheckoutReducer, {
    loaded: false,
    subtotalPrice: 0,
    itemCount: 0,
    products: [],
    webUrl: '',
  })

  // add to cart
  const addItemToCart = async (variantId, quantity = 1) => {
    dispatch({
      type: shopifyActions.addItemToCart,
      payload: { variantId, quantity },
    })
  }

  // create new checkout
  const createNewCheckout = async () => {
    const checkout = await shopify.checkout.create().then((checkout) => {
      return JSON.parse(JSON.stringify(checkout))
    })

    setShopifyCheckoutId(checkout.id)
  }

  // check for existing cart
  const checkCartExistance = async () => {
    let temporalCheckout = null
    if (shopifyCheckoutId === '') {
      temporalCheckout = createNewCheckout()
    } else {
      temporalCheckout = await shopify.checkout.fetch(shopifyCheckoutId)
      if (temporalCheckout === null || temporalCheckout.completedAt !== null) {
        temporalCheckout = createNewCheckout()
      }
    }

    // dispatch({
    //   type: shopifyActions.setCheckout,
    //   payload: temporalCheckout,
    // })

    // const products = await fetchProducts()
    // dispatch({
    //   type: shopifyActions.setProducts,
    //   payload: products,
    // })
  }

  useEffect(() => {
    if (!shopify || !shopify.checkout) return

    createNewCheckout()
    checkCartExistance()
  }, [shopifyCheckoutId, setShopifyCheckoutId, shopify])

  return (
    <ShopifyContext.Provider
      value={{
        addItemToCart,
        checkout,
      }}
    >
      {children}
    </ShopifyContext.Provider>
  )
}

export default ShopifyProvider
