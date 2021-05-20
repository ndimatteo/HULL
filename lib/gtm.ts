import API from '@/lib/shared-types'

function productLabel(product: API['Product'], variant: API['Variant']) {
  return `${product.title}${
    variant.title !== 'Default Title' ? ` - ${variant.title}` : ``
  }`
}

export function track(eventName: string, payload: any = {}) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: eventName,
    ...payload,
  })
}

// TODO: type this
export function trackAddToCart({
  product,
  variant = product.variant,
  quantity = 1,
}: {
  product: any
  variant?: any
  quantity?: number
}) {
  track('add_to_cart', {
    // ecommerce: {
    //   add: {
    //     products: [
    //       {
    //         ...gtmProduct(product, variant),
    //         quantity,
    //       },
    //     ],
    //   },
    // },
    eventDetail: {
      category: 'Ecommerce',
      action: 'Add to Cart',
      label: productLabel(product, variant),
    },
  })
}
