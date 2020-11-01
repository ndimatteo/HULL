import React, { createContext, useReducer, useEffect } from 'react'
import useLocalStorage from 'react-use/lib/useLocalStorage'
import shopify from '../lib/shopify'
import { unique } from '../lib/helpers'
import { Base64 } from 'base64-string'

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

      return {
        ...state,
        itemCount: lineItems.length,
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
    lineItems: null,
    webUrl: '',
  })

  // handle quantity increment + decrement
  const updateItemQuantity = async (variantId, quantity) => {
    console.log('handle quantity change')
  }

  const removeItemFromCart = async (variantId) => {
    const temporalCheckout = await shopify.checkout.removeLineItems(
      shopifyCheckoutId,
      [variantId]
    )
    dispatch({
      type: shopifyActions.setCheckout,
      payload: temporalCheckout,
    })
  }

  // add to cart
  const addItemToCart = async (variantId, quantity = 1) => {
    const enc = new Base64()
    const variantIdUrl = enc.urlEncode(
      `gid://shopify/ProductVariant/${variantId}`
    )
    const lineItems = {
      variantId: variantIdUrl,
      quantity: quantity,
    }

    const temporalCheckout = await shopify.checkout.addLineItems(
      shopifyCheckoutId,
      lineItems
    )

    dispatch({
      type: shopifyActions.addItemToCart,
      payload: { variantId, quantity },
    })
    dispatch({
      type: shopifyActions.setCheckout,
      payload: temporalCheckout,
    })
  }

  // fetch all products
  async function fetchProducts() {
    const products = await client.product.fetchAll()
    return products
  }

  // create new checkout
  const createNewCheckout = async () => {
    const checkout = await shopify.checkout.create().then((checkout) => {
      return JSON.parse(JSON.stringify(checkout))
    })

    setShopifyCheckoutId(checkout.id)
    return checkout
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

    dispatch({
      type: shopifyActions.setCheckout,
      payload: temporalCheckout,
    })

    // const products = await fetchProducts()
    // dispatch({
    //   type: shopifyActions.setProducts,
    //   payload: products,
    // })
  }

  useEffect(() => {
    if (!shopify || !shopify.checkout) return
    checkCartExistance()
  }, [])

  return (
    <ShopifyContext.Provider
      value={{
        addItemToCart,
        updateItemQuantity,
        removeItemFromCart,
        checkout,
      }}
    >
      {children}
    </ShopifyContext.Provider>
  )
}

export default ShopifyProvider
