function productLabel(product, variant) {
  return `${product.title}${
    variant.title !== 'Default Title' ? ` - ${variant.title}` : ``
  }`
}

export function track(eventName, payload = {}) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: eventName,
    ...payload,
  })
}

export function trackAddToCart({
  product,
  variant = product.variant,
  quantity = 1,
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
