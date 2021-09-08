import React, { createContext, useContext, useEffect, useState } from 'react'
import { Base64 } from 'base64-string'

// get our API clients (shopify + sanity)
import { getSanityClient } from '@lib/sanity'
import shopify from '@lib/shopify'

// get our global image GROQ
import { queries } from '@data'

// Set our initial context states
const initialContext = {
  isPageTransition: false,
  meganav: {
    isOpen: false,
    activeID: null,
  },
  productCounts: [],
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
const SiteContext = createContext({
  context: initialContext,
  setContext: () => null,
})

// Build a new checkout
const createNewCheckout = (context) => {
  return context.shopifyClient?.checkout.create({
    presentmentCurrencyCode: 'USD',
  })
}

// Get Shopify checkout cart
const fetchCheckout = (context, id) => {
  return context.shopifyClient?.checkout.fetch(id)
}

// get associated variant from Sanity
const fetchVariant = async (id) => {
  const variant = await getSanityClient().fetch(
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
              ${queries.imageMeta}
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

// set Shopify variables
const shopifyCheckoutID = 'shopify_checkout_id'
const shopifyVariantGID = 'gid://shopify/ProductVariant/'

// set our checkout states
const setCheckoutState = async (checkout, setContext, openCart) => {
  if (!checkout) return null

  if (typeof window !== `undefined`) {
    localStorage.setItem(shopifyCheckoutID, checkout.id)
  }

  // get real lineItems data from Sanity
  const lineItems = await Promise.all(
    checkout.lineItems.map(async (item) => {
      const enc = new Base64()
      const variantID = enc.decode(item.variant.id).split(shopifyVariantGID)[1]
      const variant = await fetchVariant(variantID)

      return { ...variant, quantity: item.quantity, lineID: item.id }
    })
  )

  // update state
  setContext((prevState) => {
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
        webUrl: checkout.webUrl,
      },
    }
  })
}

/*  ------------------------------ */
/*  Our Context Wrapper
/*  ------------------------------ */

const SiteContextProvider = ({ data, children }) => {
  const { productCounts } = data

  const [context, setContext] = useState({
    ...initialContext,
    ...{ productCounts },
  })

  const [initContext, setInitContext] = useState(false)

  useEffect(() => {
    // Shopify checkout not build yet
    if (initContext === false) {
      const initializeCheckout = async () => {
        const existingCheckoutID =
          typeof window !== 'undefined'
            ? localStorage.getItem(shopifyCheckoutID)
            : false

        // existing Shopify checkout ID found
        if (existingCheckoutID) {
          try {
            // fetch checkout from Shopify
            const existingCheckout = await fetchCheckout(
              context,
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
              setCheckoutState(existingCheckout, setContext)
              return
            }
          } catch (e) {
            localStorage.setItem(shopifyCheckoutID, null)
          }
        }

        // Otherwise, create a new checkout!
        const newCheckout = await createNewCheckout(context)
        setCheckoutState(newCheckout, setContext)
      }

      // Initialize the store context
      initializeCheckout()
      setInitContext(true)
    }
  }, [initContext, context, setContext, context.shopifyClient?.checkout])

  return (
    <SiteContext.Provider
      value={{
        context,
        setContext,
      }}
    >
      {children}
    </SiteContext.Provider>
  )
}

// Access our global store states
function useSiteContext() {
  const { context } = useContext(SiteContext)
  return context
}

// Toggle page transition state
function useTogglePageTransition() {
  const {
    context: { isPageTransition },
    setContext,
  } = useContext(SiteContext)

  async function togglePageTransition(state) {
    setContext((prevState) => {
      return { ...prevState, isPageTransition: state }
    })
  }
  return togglePageTransition
}

// Toggle Mega Navigation states
function useToggleMegaNav() {
  const {
    context: { meganav },
    setContext,
  } = useContext(SiteContext)

  async function toggleMegaNav(state, id = null) {
    setContext((prevState) => {
      return {
        ...prevState,
        meganav: {
          isOpen: state === 'toggle' ? !meganav.isOpen : state,
          activeID: state === 'toggle' && meganav.isOpen ? null : id,
        },
      }
    })
  }
  return toggleMegaNav
}

/*  ------------------------------ */
/*  Our Shopify context helpers
/*  ------------------------------ */

// Access our cart item count
function useCartCount() {
  const {
    context: { checkout },
  } = useContext(SiteContext)

  let count = 0

  if (checkout.lineItems) {
    count = checkout.lineItems.reduce((total, item) => item.quantity + total, 0)
  }

  return count
}

// Access our cart totals
function useCartTotals() {
  const {
    context: { checkout },
  } = useContext(SiteContext)

  const subTotal = checkout.subTotal ? checkout.subTotal.amount * 100 : false
  return {
    subTotal,
  }
}

// Access our cart items
function useCartItems() {
  const {
    context: { checkout },
  } = useContext(SiteContext)

  return checkout.lineItems
}

// Add an item to the checkout cart
function useAddItem() {
  const {
    context: { checkout, shopifyClient },
    setContext,
  } = useContext(SiteContext)

  async function addItem(variantID, quantity, attributes) {
    // Bail if no ID or quantity given
    if (!variantID || !quantity) return

    // Otherwise, start adding the product
    setContext((prevState) => {
      return { ...prevState, isAdding: true, isUpdating: true }
    })

    // build encoded variantID
    const enc = new Base64()
    const variant = enc.urlEncode(`${shopifyVariantGID}${variantID}`)

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
    setCheckoutState(newCheckout, setContext, true)
  }

  return addItem
}

// Update item in cart
function useUpdateItem() {
  const {
    context: { checkout, shopifyClient },
    setContext,
  } = useContext(SiteContext)

  async function updateItem(itemID, quantity) {
    // Bail if no ID or quantity given
    if (!itemID || !quantity) return

    // Otherwise, start adding the product
    setContext((prevState) => {
      return { ...prevState, isUpdating: true }
    })

    const newCheckout = await shopifyClient.checkout.updateLineItems(
      checkout.id,
      [{ id: itemID, quantity: quantity }]
    )

    setCheckoutState(newCheckout, setContext)
  }
  return updateItem
}

// Remove item from cart
function useRemoveItem() {
  const {
    context: { checkout, shopifyClient },
    setContext,
  } = useContext(SiteContext)

  async function removeItem(itemID) {
    // Bail if no ID given
    if (!itemID) return

    // Otherwise, start removing the product
    setContext((prevState) => {
      return { ...prevState, isUpdating: true }
    })

    const newCheckout = await shopifyClient.checkout.removeLineItems(
      checkout.id,
      [itemID]
    )

    setCheckoutState(newCheckout, setContext)
  }
  return removeItem
}

// Build our Checkout URL
function useCheckout() {
  const {
    context: { checkout },
  } = useContext(SiteContext)

  return checkout.webUrl
}

// Toggle cart state
function useToggleCart() {
  const {
    context: { isCartOpen },
    setContext,
  } = useContext(SiteContext)

  async function toggleCart() {
    setContext((prevState) => {
      return { ...prevState, isCartOpen: !isCartOpen }
    })
  }
  return toggleCart
}

// Reference a collection product count
function useProductCount() {
  const {
    context: { productCounts },
  } = useContext(SiteContext)

  function productCount(collection) {
    const collectionItem = productCounts.find((c) => c.slug === collection)
    return collectionItem.count
  }

  return productCount
}

export {
  SiteContextProvider,
  useSiteContext,
  useTogglePageTransition,
  useToggleMegaNav,
  useCartCount,
  useCartTotals,
  useCartItems,
  useAddItem,
  useUpdateItem,
  useRemoveItem,
  useCheckout,
  useToggleCart,
  useProductCount,
}
