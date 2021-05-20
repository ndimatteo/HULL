import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { Base64 } from 'base64-string'

// get our API clients (shopify + sanity)
import { getSanityClient } from '@/lib/sanity'
import shopify from '@/lib/shopify'
import type { CustomAttribute } from 'shopify-buy'
// get our global image GROQ
import { imageMeta } from '@/lib/api'
import type API from '@/lib/shared-types'

// TODO: break this up into separate states to simplify typing
// Set our initial context states
const initialContext = {
  meganav: {
    isOpen: false,
    activeID: null,
  },
  productCounts: null,
  shopifyClient: shopify,
  isLoading: true,
  isAdding: false,
  isUpdating: false,
  isCartOpen: false,
  checkout: {
    id: 0,
    subTotal: undefined,
    lineItems: [],
    checkoutUrl: undefined,
  },
}

interface Context {
  context: {
    productCounts:
      | {
          slug: string
          count: number
        }[]
      | null
    meganav: {
      isOpen: boolean
      activeID: null
    }
    shopifyClient: ShopifyBuy.Client
    isLoading: boolean
    isAdding: boolean
    isUpdating: boolean
    isCartOpen: boolean
    checkout: {
      id: number | undefined
      subTotal: { amount: number } | undefined
      lineItems: any[]
      checkoutUrl: string | undefined
    }
  }

  setContext: React.Dispatch<React.SetStateAction<any>>
}

// Set context
const SiteContext = createContext<Context>({
  context: initialContext,
  setContext: () => {},
})

// Build a new checkout
const createNewCheckout = (context: Context['context']) => {
  return context.shopifyClient?.checkout.create()
}

// Get Shopify checkout cart
const fetchCheckout = (context: Context['context'], id: string) => {
  return context.shopifyClient?.checkout.fetch(id)
}

// get associated variant from Sanity
const fetchVariant = async (id: string) => {
  try {
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
              ${imageMeta}
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
  } catch (err) {
    console.error('Error while fetching variant', err)
  }
}

// set Shopify variables
const shopifyCheckoutID = 'shopify_checkout_id'
const shopifyVariantGID = 'gid://shopify/ProductVariant/'

// set our checkout states
const setCheckoutState = async (
  checkout: ShopifyBuy.Cart,
  setContext: Context['setContext'],
  openCart = false
) => {
  if (!checkout) return null

  if (typeof window !== `undefined`) {
    localStorage.setItem(shopifyCheckoutID, checkout.id.toString())
  }

  // get real lineItems data from Sanity
  const lineItems = await Promise.all(
    checkout.lineItems.map(async (item) => {
      const enc = new Base64()
      // @ts-ignore
      const variantID = enc.decode(item.variant.id).split(shopifyVariantGID)[1]
      const variant = await fetchVariant(variantID)

      return { ...variant, quantity: item.quantity, lineID: item.id }
    })
  )

  // update state TODO: clean up these anys
  setContext((prevState: any) => {
    return {
      ...prevState,
      isAdding: false,
      isLoading: false,
      isUpdating: false,
      isCartOpen: openCart ? true : prevState.isCartOpen,
      checkout: {
        id: checkout.id,
        lineItems: lineItems,
        // @ts-expect-error - shopify types are completely fucked
        subTotal: checkout.lineItemsSubtotalPrice,
        // @ts-expect-error - shopify types are completely fucked
        checkoutUrl: checkout.webUrl,
      },
    }
  })
}

/*  ------------------------------ */
/*  Our Context Wrapper
/*  ------------------------------ */

type SiteContextProviderProps = {
  data: API['SiteData']
  children: React.ReactChild
}

const SiteContextProvider = ({ data, children }: SiteContextProviderProps) => {
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
              existingCheckout.lineItems.some((lineItem) => !lineItem.variantId)
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
            localStorage.setItem(shopifyCheckoutID, '')
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

// Toggle Mega Navigation states
function useToggleMegaNav() {
  const {
    context: { meganav },
    setContext,
  } = useContext(SiteContext)

  async function toggleMegaNav(state: string | boolean, id?: number | string) {
    // @ts-ignore
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

  const subTotal = checkout.subTotal
    ? checkout.subTotal.amount * 100
    : undefined
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

  async function addItem(
    variantID: string | number,
    quantity: number,
    customAttributes?: CustomAttribute[]
  ) {
    // Bail if no ID or quantity given
    if (!variantID || !quantity || !checkout.id) return

    // @ts-ignore Otherwise, start adding the product
    setContext((prevState) => {
      return { ...prevState, isAdding: true, isUpdating: true }
    })

    // build encoded variantID
    const enc = new Base64()
    const variant = enc.urlEncode(`${shopifyVariantGID}${variantID}`)

    // Build the cart line item
    const newItem = [
      {
        variantId: variant,
        quantity,
        customAttributes,
      },
    ]

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

  const updateItem = useCallback(
    async (itemID: string, quantity: number) => {
      // Bail if no ID or quantity given
      if (!itemID || !quantity || !checkout.id) return

      // Otherwise, start adding the product
      // @ts-ignore
      setContext((prevState) => ({ ...prevState, isUpdating: true }))

      const newCheckout = await shopifyClient.checkout.updateLineItems(
        checkout.id,
        [{ id: itemID, quantity: quantity }]
      )

      setCheckoutState(newCheckout, setContext)
    },
    [checkout, shopifyClient, setContext]
  )

  return updateItem
}

// Remove item from cart
function useRemoveItem() {
  const {
    context: { checkout, shopifyClient },
    setContext,
  } = useContext(SiteContext)

  const removeItem = useCallback(
    async (itemID: string) => {
      // Bail if no ID given
      if (!itemID || !checkout.id) return

      // @ts-ignore Otherwise, start removing the product
      setContext((prevState) => {
        return { ...prevState, isUpdating: true }
      })

      const newCheckout = await shopifyClient.checkout.removeLineItems(
        checkout.id,
        [itemID]
      )

      setCheckoutState(newCheckout, setContext)
    },
    [checkout, shopifyClient, setContext]
  )

  return removeItem
}

// Build our Checkout URL
function useCheckout() {
  const {
    context: { checkout },
  } = useContext(SiteContext)

  return checkout.checkoutUrl
}

// Toggle cart state
function useToggleCart() {
  const {
    context: { isCartOpen },
    setContext,
  } = useContext(SiteContext)

  const toggleCart = useCallback(
    async (toggleValue?: boolean) =>
      // @ts-ignore
      setContext((prevState) => ({
        ...prevState,
        isCartOpen: toggleValue ? toggleValue : !isCartOpen,
      })),
    [isCartOpen, setContext]
  )

  return toggleCart
}

// Reference a collection product count
function useProductCount() {
  const {
    context: { productCounts },
  } = useContext(SiteContext)

  const productCount = useCallback(
    (collection: string) => {
      const collectionItem = productCounts?.find((c) => c.slug === collection)
      return collectionItem?.count
    },
    [productCounts]
  )

  return productCount
}

export {
  SiteContextProvider,
  useSiteContext,
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
