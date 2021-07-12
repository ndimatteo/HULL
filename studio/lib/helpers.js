export const getTypeTitles = types => {
  const typeNames = types.map(type => {
    switch (type) {
      case 'freeform':
        return 'Freeform'
      case 'accordions':
        return 'Accordions'
      case 'productCard':
        return 'Product Card'
      default:
        return null
    }
  })

  return typeNames.join(' + ')
}

export const getTypeSubtitle = block => {
  switch (block._type) {
    case 'freeform':
      return getPtPreview(block?.content[0])
    case 'accordions':
      return `${block?.items.length} item(s)`
    case 'productCard':
      return block?.product?.title
    default:
      return null
  }
}

export const getPtPreview = content => {
  switch (content._type) {
    case 'photo':
      return `Photo: ${content.alt}`
    default:
      return content?.children[0]?.text
  }
}

export const getStaticRoute = name => {
  switch (name) {
    default:
      return false
  }
}

export const getDynamicRoute = name => {
  switch (name) {
    case 'collection':
      return 'shop'
    case 'product':
      return 'products'
    default:
      return false
  }
}
