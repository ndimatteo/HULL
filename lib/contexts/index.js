import React, { createContext, useContext, useEffect, useState } from 'react'

import { siteContext } from './site'

import { shopifyCheckoutID, shopifyContext, setCheckoutState } from './shopify'

// Set initial store states
const initialContext = {
  ...siteContext,
  ...shopifyContext,
}

// Set context
const SiteContext = createContext({
  context: initialContext,
  setContext: () => null,
})

// Build a new checkout
const createNewCheckout = (context) => {
  return context.shopifyClient.checkout.create()
}

// Get Shopify checkout cart
const fetchCheckout = (context, id) => {
  return context.shopifyClient.checkout.fetch(id)
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
            if (existingCheckout.completedAt) {
              throw new Error('Checkout was already completed.')
            }

            setCheckoutState(existingCheckout, setContext)
            return
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
  }, [initContext, context, setContext, context.shopifyClient.checkout])

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

export { SiteContextProvider, useSiteContext, SiteContext }
