import React, { createContext, useReducer } from 'react'

export const ShopifyContext = createContext()

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

    // case shopifyActions.setCheckout:
    //   const { lineItems = [], subtotalPrice = 0, webUrl = '' } = action.payload
    //   const bundleCount = lineItems
    //     .map((i) => i.customAttributes[0].value)
    //     .filter(unique).length

    //   return {
    //     ...state,
    //     itemCount: bundleCount,
    //     lineItems,
    //     bundleSize: 5,
    //     subtotalPrice,
    //     webUrl,
    //     loaded: true,
    //     bundle: [],
    //   }

    default:
      throw new Error(`Action of type ${action.type} does not exist.`)
  }
}

const ShopifyProvider = ({ children }) => {
  // const client = useMemo(() => createShopifyClient(), [createShopifyClient]) //eslint-disable-line

  // const [shopifyCheckoutId, setShopifyCheckoutId] = useLocalStorage(
  //   persistedStateId,
  //   ''
  // )

  const [checkout, dispatch] = useReducer(shopifyCheckoutReducer, {
    loaded: false,
    itemCount: 0,
    products: [],
    webUrl: '',
  })

  async function addItemToCart(variantId, quantity = 1) {
    dispatch({
      type: shopifyActions.addItemToCart,
      payload: { variantId, quantity },
    })
  }

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
