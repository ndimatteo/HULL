import { Base64 } from 'base64-string'
import { createContext, useContext, useEffect, useState } from 'react'

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
  cart: {},
}

// Set context
const SiteContext = createContext({
  context: initialContext,
  setContext: () => null,
})

// set Shopify variables
const shopifyCheckoutID = 'shopify_checkout_id'
const shopifyCartID = 'shopify_cart_id'
const shopifyVariantGID = 'gid://shopify/ProductVariant/'

// Set ShopifyGraphQL as a function so we can reuse it
async function shopifyGraphQL(query, variables) {
  try {
    const res = await fetch(
      `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_ID}.myshopify.com/api/2023-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token':
            process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN,
        },
        body: JSON.stringify({
          query: query,
          variables: variables ?? null,
        }),
      },
    )

    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
    return ''
  }
}
// defining what the query returns for the product so that we can easily reuse it
const graphProduct = `product {
                title
                handle
                images(first: 5) {
                  edges {
                    node {
                      id
                      originalSrc
                      altText
                    }
                  }
                }
              }`

const graphCart = `cart {
      id
      checkoutUrl
      lines(first: 250) {
        edges {
          node {
            id
            merchandise {
              ... on ProductVariant {
                id
                ${graphProduct}
              }
            }
            quantity
				cost {
            amountPerQuantity {
              amount
            }
            compareAtAmountPerQuantity {
              amount
            }
            subtotalAmount {
              amount
            }
            totalAmount {
              amount
            }
          }
          }
        }
      }
      cost {
        checkoutChargeAmount {
          amount
        }
      }
    }`

// Build a new checkout
const createNewCheckout = (context) => {
  return context.shopifyClient?.checkout.create({
    presentmentCurrencyCode: 'CAD',
  })
}

const createNewCart = async (context) => {
  // GraphQL query to create a cart
  const query = `mutation {
  cartCreate(input: {lines: []}) {
    cart {
      id
      checkoutUrl
      cost {
        checkoutChargeAmount {
          amount
        }
      }
    }
  }
}`
  const queryResponse = await shopifyGraphQL(query)
  const cart = queryResponse.data.cartCreate.cart
  // NEED TO ADD CART TO CONTEXT BUT HOW—seems that L322 is doing the trick
  return cart
}

// Get Shopify checkout cart
const fetchCheckout = (context, id) => {
  return context.shopifyClient?.checkout.fetch(id)
}

const fetchCart = async (id) => {
  // GraphQL query to fetch a cart
  const query = `{
  cart(id: "${id}") {
    id
      checkoutUrl
      lines(first: 250) {
        edges {
          node {
            id
            merchandise {
              ... on ProductVariant {
                id
                ${graphProduct}
              }
            }
            quantity
				cost {
            amountPerQuantity {
              amount
            }
            compareAtAmountPerQuantity {
              amount
            }
            subtotalAmount {
              amount
            }
            totalAmount {
              amount
            }
          }
          }
        }
      }
      cost {
        checkoutChargeAmount {
          amount
        }
      }
  }
}`
  const queryResponse = await shopifyGraphQL(query)
  const cart = queryResponse.data.cart
  return cart
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
    `,
  )

  return variant
}

// set our checkout states
const setCheckoutState = async (checkout, setContext, openCart) => {
  if (!checkout) return null

  if (typeof window !== `undefined`) {
    localStorage.setItem(shopifyCheckoutID, checkout.id)
  }

  // get real lineItems data from Sanity
  const lineItems = await Promise.all(
    checkout.lineItems.map(async (item) => {
      const variantID = item.variant.id.split(shopifyVariantGID)[1]
      const variant = await fetchVariant(variantID)

      return { ...variant, quantity: item.quantity, lineID: item.id }
    }),
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

// set our cart states
const setCartState = async (cart, setContext, openCart) => {
  if (!cart) return null

  if (typeof window !== `undefined`) {
    localStorage.setItem(shopifyCartID, cart.id)
    localStorage.setItem(cart, JSON.stringify(cart))
  }

  /*
	// get real lineItems data from Sanity
	const lineItems = await Promise.all(
		cart.lines.edges.map(async (edge) => {
			const variantID = edge.node.merchandise.id.replace(shopifyVariantGID, '');
			const variant = await fetchVariant(variantID);

			return { ...variant, quantity: item.quantity, lineID: item.id };
		}),
	);
	*/

  // update state
  setContext((prevState) => {
    return {
      ...prevState,
      isAdding: false,
      isLoading: false,
      isUpdating: false,
      isCartOpen: openCart ? true : prevState.isCartOpen,
      cart: cart,
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
              existingCheckoutID,
            )

            // Check if there are invalid items
            if (
              existingCheckout.lineItems.some((lineItem) => !lineItem.variant)
            ) {
              throw new Error(
                'Invalid item in checkout. This variant was probably deleted from Shopify.',
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

      const initializeCart = async () => {
        const existingCartID = localStorage.getItem(shopifyCartID)
        //('The existing cart id');
        //console.log(existingCartID);

        // existing Shopify checkout ID found
        if (existingCartID != 'null') {
          console.log('SiteContextProvider: Fetching our existing cart')
          try {
            // fetch checkout from Shopify
            const existingCart = await fetchCart(existingCartID)
            //console.log(existingCart);
            setCartState(existingCart, setContext)
          } catch (e) {
            console.log(
              `Couldn't fetch the existing cart... Creating a new one...`,
            )
            const newCart = await createNewCart(context)
            //console.log(newCart);
            setCartState(newCart, setContext)
          }
        } else {
          // Otherwise, create a new checkout!
          console.log('SiteContextProvider: Creating a new cart')
          const newCart = await createNewCart(context)
          //console.log(newCart);
          setCartState(newCart, setContext)
        }
      }

      // Initialize the store context
      initializeCheckout()
      initializeCart()
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
function useCheckoutCount() {
  const {
    context: { checkout },
  } = useContext(SiteContext)

  let count = 0

  if (checkout.lineItems) {
    count = checkout.lineItems.reduce((total, item) => item.quantity + total, 0)
  }

  return count
}

function useCartCount() {
  const {
    context: { cart },
  } = useContext(SiteContext)

  let count = 0
  if (cart?.lines) {
    for (let i = 0; i < cart.lines.edges.length; i++) {
      count += cart.lines.edges[i].node.quantity
    }
  }

  return count
}

// Access our cart totals
function useCheckoutTotals() {
  const {
    context: { checkout },
  } = useContext(SiteContext)

  const subTotal = checkout.subTotal ? checkout.subTotal.amount * 100 : false
  return {
    subTotal,
  }
}

function useCartTotals() {
  const {
    context: { cart },
  } = useContext(SiteContext)

  // Our GraphQL queries always return this property:
  /*
		The estimated amount, before taxes and discounts, for the customer to pay at checkout.
		The checkout charge amount doesn't include any deferred payments that'll be paid at a later date.
		If the cart has no deferred payments, then the checkout charge amount is equivalent to subtotalAmount.
	*/
  // We might want to use a different key in order to get discount included
  // https://shopify.dev/docs/api/storefront/2023-10/objects/CartCost
  const subTotal = cart?.cost?.checkoutChargeAmount?.amount
    ? cart.cost.checkoutChargeAmount.amount
    : false
  return {
    subTotal,
  }
}

// Access our cart items
function useCheckoutItems() {
  const {
    context: { checkout },
  } = useContext(SiteContext)

  return checkout.lineItems
}

// Access our cart items
function useCartItems() {
  const {
    context: { cart },
  } = useContext(SiteContext)

  return cart?.lines?.edges
}

// Add an item to the checkout cart
function useAddItem() {
  const {
    context: { cart, checkout, shopifyClient },
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

    /*
		// Add it to the Shopify checkout cart
		const newCheckout = await shopifyClient.checkout.addLineItems(
			checkout.id,
			newItem,
		);
		*/

    // We check if the context is providing a cart.id otherwise we rely on the localStorage we set up.
    // Definitely ugly but I can't figure out how to update the context for cart
    cart.id == undefined ? localStorage.getItem(shopifyCartID) : cart.id

    // GraphQL query to add items to the cart
    const query = `mutation {
  cartLinesAdd(
    cartId: "${cart.id}"
    lines: [
		{
			merchandiseId: "${variant}",
			quantity: ${quantity}
		}
	]
  ) {
   ${graphCart}
    userErrors {
      field
      message
    }
  }
}`
    const queryResponse = await shopifyGraphQL(query)
    const newCart = queryResponse.data.cartLinesAdd.cart

    //setCheckoutState(newCheckout, setContext, true);
    setCartState(newCart, setContext, true)
  }

  return addItem
}

// Update item in cart
function useUpdateItem() {
  const {
    context: { cart, checkout, shopifyClient },
    setContext,
  } = useContext(SiteContext)

  async function updateItem(itemID, quantity) {
    // Bail if no ID or quantity given
    if (!itemID || !quantity) return

    // Otherwise, start adding the product
    setContext((prevState) => {
      return { ...prevState, isUpdating: true }
    })

    /*
		const newCheckout = await shopifyClient.checkout.updateLineItems(
			checkout.id,
			[{ id: itemID, quantity: quantity }],
		);
		*/

    // We check if the context is providing a cart.id otherwise we rely on the localStorage we set up.
    // Definitely ugly but I can't figure out how to update the context for cart
    cart.id == undefined ? localStorage.getItem(shopifyCartID) : cart.id

    // GraphQL query to update items in the cart
    const query = `mutation {
  cartLinesUpdate(
    cartId: "${cart.id}"
    lines: [
      {
        id: "${itemID}",
        quantity: ${quantity}
      },
    ]
  ) {
    ${graphCart}
    userErrors {
      field
      message
    }
  }
}`
    const queryResponse = await shopifyGraphQL(query)
    const newCart = queryResponse.data.cartLinesUpdate.cart

    //setCheckoutState(newCheckout, setContext);
    setCartState(newCart, setContext)
  }
  return updateItem
}

// Remove item from cart
function useRemoveItem() {
  const {
    context: { cart, heckout, shopifyClient },
    setContext,
  } = useContext(SiteContext)

  async function removeItem(itemID) {
    // Bail if no ID given
    if (!itemID) return

    // Otherwise, start removing the product
    setContext((prevState) => {
      return { ...prevState, isUpdating: true }
    })

    /*
		const newCheckout = await shopifyClient.checkout.removeLineItems(
			checkout.id,
			[itemID],
		);
		*/

    // We check if the context is providing a cart.id otherwise we rely on the localStorage we set up.
    // Definitely ugly but I can't figure out how to update the context for cart
    cart.id == undefined ? localStorage.getItem(shopifyCartID) : cart.id

    // GraphQL query to remove items from the cart
    const query = `mutation {
  cartLinesRemove(
    cartId: "${cart.id}"
    lineIds: [
    "${itemID}"
    ]
  ) {
    ${graphCart}
    userErrors {
      field
      message
    }
  }
}`
    const queryResponse = await shopifyGraphQL(query)
    const newCart = queryResponse.data.cartLinesRemove.cart

    //setCheckoutState(newCheckout, setContext);
    setCartState(newCart, setContext)
  }
  return removeItem
}

// Build our Checkout URL
function useCheckout() {
  const {
    context: { cart, checkout },
  } = useContext(SiteContext)

  return cart.checkoutUrl
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
  useAddItem,
  useCartCount,
  useCartItems,
  useCartTotals,
  useCheckout,
  useCheckoutCount,
  useCheckoutItems,
  useCheckoutTotals,
  useProductCount,
  useRemoveItem,
  useSiteContext,
  useToggleCart,
  useToggleMegaNav,
  useTogglePageTransition,
  useUpdateItem
}

