import React, { createContext, useContext, useEffect, useState } from 'react'
import { Base64 } from 'base64-string'

import sanity from '../lib/sanity'
import shopify from '../lib/shopify'

// Set localStorage variable
const SHOPIFY_CHECKOUT_ID = 'shopify_checkout_id'
const SHOPIFY_VARIANT_GID = 'gid://shopify/ProductVariant/'

// Set initial store states
const initialStoreState = {
  shopifyClient: shopify,
  isLoading: true,
  isAdding: false,
  isUpdating: false,
  isCartOpen: false,
  checkout: {
    id: null,
    lineItems: [],
  },
}

// Set context
const ShopifyContext = createContext({
  store: initialStoreState,
  setStore: () => null,
})

// Build a new checkout
const createNewCheckout = (store) => {
  return store.shopifyClient.checkout.create()
}

// Get Shopify checkout cart
const fetchCheckout = (store, id) => {
  return store.shopifyClient.checkout.fetch(id)
}

// get associated variant from Sanity
const fetchVariant = async (id) => {
  const variant = await sanity.fetch(
    `
      *[_type == "productVariant" && variantID == ${id}][0]{
        "product": *[_type == "product" && productID == ^.productID][0]{
          title,
          "slug": slug.current,
        },
        "id": variantID,
        title,
        price,
        "photos": {
          "cart": *[_type == "product" && productID == ^.productID][0].cartPhotos[]{
            forOption,
            "default": cartPhoto{
              "id": asset->assetId,
              asset,
              crop,
              hotspot,
              alt
            },
          }
        },
        options[]{
          name,
          position,
          value
        }
      }
    `
  )

  return variant
}

// get custom Shopify domain, since they don't return that in the webhook payload
const fetchStoreDomain = async () => {
  const domain = await sanity.fetch(
    `
      *[_type == "generalSettings"][0].storeURL
    `
  )

  return domain
}

// Save checkout to localstorage
const setCheckoutState = async (checkout, setStore, openCart) => {
  if (typeof window !== `undefined`) {
    localStorage.setItem(SHOPIFY_CHECKOUT_ID, checkout.id)
  }

  // get real lineItems data from Sanity
  const lineItems = await Promise.all(
    checkout.lineItems.map(async (item) => {
      const enc = new Base64()
      const variantID = enc
        .decode(item.variant.id)
        .split(SHOPIFY_VARIANT_GID)[1]
      const variant = await fetchVariant(variantID)

      return { ...variant, quantity: item.quantity, lineID: item.id }
    })
  )

  const storeDomain = await fetchStoreDomain()

  // update state
  setStore((prevState) => {
    return {
      ...prevState,
      isAdding: false,
      isLoading: false,
      isUpdating: false,
      isCartOpen: openCart ? true : prevState.isCartOpen,
      checkout: {
        id: checkout.id,
        lineItems: lineItems,
        subTotal: checkout.lineItemsSubtotalPrice,
        webUrl: storeDomain
          ? checkout.webUrl.replace(
              /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/g,
              storeDomain
            )
          : checkout.webUrl,
      },
    }
  })
}

/*  ------------------------------ */
/*  Our Context Wrapper
/*  ------------------------------ */

const ShopifyContextProvider = ({ children }) => {
  const [store, setStore] = useState(initialStoreState)
  const [initStore, setInitStore] = useState(false)

  useEffect(() => {
    // Shopify checkout not build yet
    if (initStore === false) {
      const initializeCheckout = async () => {
        const existingCheckoutID =
          typeof window !== 'undefined'
            ? localStorage.getItem(SHOPIFY_CHECKOUT_ID)
            : false

        // existing Shopify checkout ID found
        if (existingCheckoutID) {
          try {
            // fetch checkout from Shopify
            const existingCheckout = await fetchCheckout(
              store,
              existingCheckoutID
            )

            // Check if there are invalid items
            if (
              existingCheckout.lineItems.some((lineItem) => !lineItem.variant)
            ) {
              throw new Error(
                'Invalid item in checkout. This variant was probably deleted from Shopify.'
              )
            }

            // Make sure this cart hasn’t already been purchased.
            if (!existingCheckout.completedAt) {
              setCheckoutState(existingCheckout, setStore)
              return
            }
          } catch (e) {
            localStorage.setItem(SHOPIFY_CHECKOUT_ID, null)
          }
        }

        // Otherwise, create a new checkout!
        const newCheckout = await createNewCheckout(store)
        setCheckoutState(newCheckout, setStore)
      }

      // Initialize the store context
      initializeCheckout()
      setInitStore(true)
    }
  }, [initStore, store, setStore, store.shopifyClient.checkout])

  return (
    <ShopifyContext.Provider
      value={{
        store,
        setStore,
      }}
    >
      {children}
    </ShopifyContext.Provider>
  )
}

/*  ------------------------------ */
/*  Our Shopify context helpers
/*  ------------------------------ */

// Access our global store states
function useStore() {
  const { store } = useContext(ShopifyContext)
  return store
}

// Access our cart items
function useCartItems() {
  const {
    store: { checkout },
  } = useContext(ShopifyContext)

  return checkout.lineItems
}

// Add an item to the checkout cart
function useAddItem() {
  const {
    store: { checkout, shopifyClient },
    setStore,
  } = useContext(ShopifyContext)

  async function addItem(variantID, quantity, attributes) {
    // Bail if no ID or quantity given
    if (!variantID || !quantity) return

    // Otherwise, start adding the product
    setStore((prevState) => {
      return { ...prevState, isAdding: true, isUpdating: true }
    })

    // build encoded variantID
    const enc = new Base64()
    const variant = enc.urlEncode(`${SHOPIFY_VARIANT_GID}${variantID}`)

    // Build the cart line item
    const newItem = {
      variantId: variant,
      quantity: quantity,
      customAttributes: attributes,
    }

    // Add it to the Shopify checkout cart
    const newCheckout = await shopifyClient.checkout.addLineItems(
      checkout.id,
      newItem
    )

    // Update our global store states
    setCheckoutState(newCheckout, setStore, true)
    // setStore((prevState) => {
    //   return {
    //     ...prevState,
    //     isAdding: false,
    //     isCartOpen: true,
    //   }
    // })
  }
  return addItem
}

// remove item from cart
function useRemoveItem() {
  const {
    store: { checkout, shopifyClient },
    setStore,
  } = useContext(ShopifyContext)

  async function removeItem(itemID) {
    // Bail if no ID given
    if (!itemID) return

    // Otherwise, start removing the product
    setStore((prevState) => {
      return { ...prevState, isUpdating: true }
    })

    const newCheckout = await shopifyClient.checkout.removeLineItems(
      checkout.id,
      [itemID]
    )

    setCheckoutState(newCheckout, setStore)
  }
  return removeItem
}

// update item in cart
function useUpdateItem() {
  const {
    store: { checkout, shopifyClient },
    setStore,
  } = useContext(ShopifyContext)

  async function updateItem(itemID, quantity) {
    // Bail if no ID or quantity given
    if (!itemID || !quantity) return

    // Otherwise, start adding the product
    setStore((prevState) => {
      return { ...prevState, isUpdating: true }
    })

    const newCheckout = await shopifyClient.checkout.updateLineItems(
      checkout.id,
      [{ id: itemID, quantity: quantity }]
    )

    setCheckoutState(newCheckout, setStore)
  }
  return updateItem
}

// Access our cart item count
function useCartCount() {
  const {
    store: { checkout },
  } = useContext(ShopifyContext)

  let count = 0

  if (checkout.lineItems) {
    count = checkout.lineItems.reduce((total, item) => item.quantity + total, 0)
  }

  return count
}

// Access our cart totals
function useCartTotals() {
  const {
    store: { checkout },
  } = useContext(ShopifyContext)

  const subTotal = checkout.subTotal ? checkout.subTotal.amount * 100 : false
  return {
    subTotal,
  }
}

// build our Checkout URL
function useCheckout() {
  const {
    store: { checkout },
  } = useContext(ShopifyContext)

  return checkout.webUrl
}

// Toggle cart state
function useToggleCart() {
  const {
    store: { isCartOpen },
    setStore,
  } = useContext(ShopifyContext)

  async function toggleCart() {
    setStore((prevState) => {
      return { ...prevState, isCartOpen: !isCartOpen }
    })
  }
  return toggleCart
}

export {
  ShopifyContextProvider,
  useStore,
  useCartTotals,
  useCartCount,
  useCartItems,
  useAddItem,
  useRemoveItem,
  useUpdateItem,
  useCheckout,
  useToggleCart,
}
