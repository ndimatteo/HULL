import { Base64 } from 'base64-string'
import { createContext, useContext, useState } from 'react'

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
const shopifyCartID = 'shopify_checkout_id'
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
      }
    )

    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
    return ''
  }
}
// defining what the query returns for the product so that we can easily reuse it
const product = `product {
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

// Build a new checkout
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
  const cart = queryResponse.data.cartCreate

  // Update our global store states
  setCartState(cart)

  return
}

// Get Shopify checkout cart
const fetchCart = async (context, id) => {
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
              ${product}
            }
          }
          quantity
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
  const cart = queryResponse.data
  // Update our global store states
  setCartState(cart)
  return
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

// set our checkout states
const setCartState = async (cart, checkout, setContext, openCart) => {
  if (!checkout && !cart) return null

  if (typeof window !== `undefined`) {
    localStorage.setItem(shopifyCartID, cart.id)
  }

  // get real lineItems data from Sanity
  const lineItems = cart?.lines
    ? await Promise.all(
        cart.lines.edges.map(async (edge) => {
          const variantID = edge.node.merchandise.id.replace(
            shopifyVariantGID,
            ''
          )
          const variant = await fetchVariant(variantID)

          return {
            ...variant,
            quantity: edge.node.quantity,
            lineID: edge.node.id,
          }
        })
      )
    : []

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
        webUrl: checkout.webUrl,
      },
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

  /* Is the error here?
	useEffect(() => {
		// Shopify checkout not build yet
		if (initContext === false) {
			const initializeCheckout = async () => {
				const existingCartID =
					typeof window !== 'undefined'
						? localStorage.getItem(shopifyCartID)
						: false;

				// existing Shopify checkout ID found
				if (existingCartID) {
					try {
						// fetch checkout from Shopify
						const existingCart = await fetchCart(context, existingCartID);

						// /* Disabling for now
						// Check if there are invalid items
						if (
							existingCheckout.lineItems.some((lineItem) => !lineItem.variant)
						) {
							throw new Error(
								'Invalid item in checkout. This variant was probably deleted from Shopify.',
							);
						}

						// Make sure this cart hasn’t already been purchased.
						if (!existingCheckout.completedAt) {
							setCartState(newCart, existingCheckout, setContext);
							return;
						}
						// *close comment
					} catch (e) {
						localStorage.setItem(shopifyCartID, null);
					}
				}

				// Otherwise, create a new checkout!
				const newCart = await createNewCart(context);
			};

			// Initialize the store context
			initializeCheckout();
			setInitContext(true);
		}
	}, [initContext, context, setContext, context.shopifyClient?.checkout]); // Needs reviewing
	*/

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
    context: { cart },
  } = useContext(SiteContext)

  let count = 0

  if (cart.lines) {
    count = cart.lines.edges.forEach((edge) => {
      count += edge.node.quantity
    })
  }

  return count
}

// Access our cart totals
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
function useCartItems() {
  const {
    context: { cart },
  } = useContext(SiteContext)

  return cart?.lines?.edges
}

// Add an item to the checkout cart
function useAddItem() {
  const {
    context: { cart },
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
     cart {
      id
      checkoutUrl
      lines(first: 250) {
        edges {
          node {
            id
            merchandise {
              ... on ProductVariant {
                id
                ${product}
              }
            }
            quantity
          }
        }
      }
      cost {
        checkoutChargeAmount {
          amount
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}`
    const queryResponse = await shopifyGraphQL(query)
    const newCart = queryResponse.data.cartLinesAdd
    console.log(newCart)
    const newCheckout = { webUrl: newCart.checkoutUrl }

    // Update our global store states
    setCartState(newCart, newCheckout, setContext, true)
  }

  return addItem
}

// Update item in cart
function useUpdateItem() {
  const {
    context: { cart },
    setContext,
  } = useContext(SiteContext)

  async function updateItem(itemID, quantity) {
    // Bail if no ID or quantity given
    if (!itemID || !quantity) return

    // Otherwise, start adding the product
    setContext((prevState) => {
      return { ...prevState, isUpdating: true }
    })

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
    cart {
      id
      checkoutUrl
      lines(first: 250) {
        edges {
          node {
            id
            merchandise {
              ... on ProductVariant {
                id
               ${product}
              }
            }
            quantity
          }
        }
      }
      cost {
        checkoutChargeAmount {
          amount
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}`
    const queryResponse = await shopifyGraphQL(query)
    const newCart = queryResponse.data.cartLinesUpdate
    console.log(newCart)
    const newCheckout = { webUrl: newCart.checkoutUrl }

    // Update our global store states
    setCartState(newCart, newCheckout, setContext, true)
  }
  return updateItem
}

// Remove item from cart
function useRemoveItem() {
  const {
    context: { cart },
    setContext,
  } = useContext(SiteContext)

  async function removeItem(itemID) {
    // Bail if no ID given
    if (!itemID) return

    // Otherwise, start removing the product
    setContext((prevState) => {
      return { ...prevState, isUpdating: true }
    })

    // GraphQL query to remove items from the cart
    const query = `mutation {
  cartLinesRemove(
    cartId: "${cart.id}"
    lineIds: [
    "${itemID}"
    ]
  ) {
    cart {
      id
      checkoutUrl
      lines(first: 250) {
        edges {
          node {
            id
            merchandise {
              ... on ProductVariant {
                id
                ${product}
              }
            }
            quantity
          }
        }
      }
      cost {
        checkoutChargeAmount {
          amount
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}`
    const queryResponse = await shopifyGraphQL(query)
    const newCart = queryResponse.data.cartLinesRemove
    console.log(newCart)
    const newCheckout = { webUrl: newCart.checkoutUrl }

    setCartState(newCart, newCheckout, setContext)
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
	useAddItem,
	useCartCount,
	useCartItems,
	useCartTotals,
	useCheckout,
	useProductCount,
	useRemoveItem,
	useSiteContext,
	useToggleCart,
	useToggleMegaNav,
	useTogglePageTransition,
	useUpdateItem
}

