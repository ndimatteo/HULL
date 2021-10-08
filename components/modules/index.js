import React from 'react'
import dynamic from 'next/dynamic'

const Grid = dynamic(() => import('./grid'))
const Hero = dynamic(() => import('./hero'))
const Marquee = dynamic(() => import('./marquee'))
const DividerPhoto = dynamic(() => import('./divider-photo'))
const ProductHero = dynamic(() => import('./product-hero'))
const Collection = dynamic(() => import('./collection-grid'))

export const Module = ({
  index,
  module,
  product,
  activeVariant,
  onVariantChange,
  collectionProducts,
}) => {
  const type = module._type

  switch (type) {
    case 'grid':
      return <Grid index={index} data={module} />
    case 'hero':
      return <Hero index={index} data={module} />
    case 'marquee':
      return <Marquee index={index} data={module} />
    case 'dividerPhoto':
      return <DividerPhoto index={index} data={module} />
    case 'productHero':
      return (
        <ProductHero
          index={index}
          product={product}
          activeVariant={activeVariant}
          onVariantChange={onVariantChange}
        />
      )
    case 'collectionGrid':
      return (
        <Collection
          index={index}
          data={{ ...module, products: collectionProducts }}
        />
      )
    default:
      return null
  }
}
