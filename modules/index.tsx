import React from 'react'
import dynamic from 'next/dynamic'
import type API from '@/lib/shared-types'

const Grid = dynamic(() => import('./grid'))
const Hero = dynamic(() => import('./hero'))
const Marquee = dynamic(() => import('./marquee'))
const DividerPhoto = dynamic(() => import('./divider-photo'))
const ProductHero = dynamic(() => import('./shop/product-hero'))
const Collection = dynamic(() => import('./shop/collection'))

interface ModuleProps {
  module: API['Module']
  product?: API['Product']
  activeVariant?: API['Variant']
  onVariantChange?: (variant: string) => void
  collectionProducts?: API['Product'][]
  featuredProducts?: API['Product'][]
}

export const Module = ({
  module,
  product,
  activeVariant,
  onVariantChange,
  collectionProducts,
  featuredProducts,
}: ModuleProps) => {
  const type = module?._type

  switch (type) {
    case 'grid':
      return <Grid data={module as API['Grid']} />
    case 'hero':
      return <Hero data={module as API['Hero']} />
    case 'marquee':
      return <Marquee data={module as API['Marquee']} />
    case 'dividerPhoto':
      return <DividerPhoto data={module as API['DividerPhoto']} />
    case 'productHero':
      if (!product || !onVariantChange) return null
      return (
        <ProductHero
          product={product}
          activeVariant={activeVariant}
          onVariantChange={onVariantChange}
        />
      )
    case 'collectionGrid':
      return (
        <Collection
          products={collectionProducts}
          featuredProducts={featuredProducts}
        />
      )
    default:
      return null
  }
}
