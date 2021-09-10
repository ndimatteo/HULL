import React from 'react'
import { Circle } from 'phosphor-react'

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

export const getSwatch = color => {
  return (
    <Circle
      color={color}
      weight="fill"
      style={{
        boxShadow: '0 0 0 1px rgba(255,255,255,.4), 0 0 0 1px rgba(0,0,0,.15)',
        borderRadius: '50%'
      }}
    />
  )
}

export const assemblePageUrl = ({ document, options }) => {
  const { slug } = document
  const { previewURL } = options
  if (!previewURL) {
    console.warn('Missing preview URL', { slug, previewURL })
    return ''
  }

  return previewURL + (slug ? `/${slug.current}` : '')
}

export const decodeAssetUrl = id => {
  const pattern = /^(?:image|file)-([a-f\d]+)-(?:(\d+x\d+)-)?(\w+)$/
  const [, assetId, dimensions, format] = pattern.exec(id)

  const [width, height] = dimensions
    ? dimensions.split('x').map(v => parseInt(v, 10))
    : []

  return {
    assetId,
    dimensions: { width, height },
    format
  }
}
