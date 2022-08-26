import React from 'react'

import Grid from './grid'
import Hero from './hero'
import Marquee from './marquee'
import DividerPhoto from './divider-photo'
import ProductHero from './product-hero'
import Collection from './collection-grid'

export const Module = ({
  index,
  data,
  product,
  activeVariant,
  onVariantChange,
}) => {
  const ModuleType = {
    grid: Grid,
    hero: Hero,
    marquee: Marquee,
    dividerPhoto: DividerPhoto,
    productHero: ProductHero,
    collectionGrid: Collection,
  }[data?._type] ?? <></>

  return (
    <ModuleType
      index={index}
      data={data}
      product={product}
      activeVariant={activeVariant}
      onVariantChange={onVariantChange}
    />
  )
}
