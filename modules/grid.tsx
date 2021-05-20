import React from 'react'
import cx from 'classnames'
import Freeform from '@/blocks/freeform'
import Accordions from '@/blocks/accordions'
import ProductCard from '@/blocks/shop/product-card'
import type { Freeform as FreeformType, SanityKeyed } from '@/lib/shared-types'
import type API from '@/lib/shared-types'

type GridProps = {
  data: API['Grid']
}
const getGridSize = (
  breakpoint?: string,
  size?: number,
  justify?: string,
  align?: string,
  start?: number
) => {
  const hasBreakpoint = breakpoint && breakpoint.trim()
  const colSpan = hasBreakpoint
    ? `${breakpoint}:col-span-${size}`
    : `col-span-${size}`

  const colStart = hasBreakpoint
    ? `${breakpoint}:col-start-${start}`
    : `col-start-${start}`

  const colJustify = hasBreakpoint ? `${breakpoint}:${justify}` : justify
  const colAlign = hasBreakpoint ? `${breakpoint}:${align}` : align

  return cx(
    colSpan,
    start && colStart,
    justify && colJustify,
    align && colAlign
  )
}

const Grid = ({ data }: GridProps) => {
  const { size, columns } = data

  if (!columns) return null

  return (
    <section className="section">
      <div className="section--content">
        <div
          className={`grid grid-cols-${size} gap-x-4 gap-y-4 sm:gap-x-8 lg:gap-x-12 lg:gap-y-6`}
        >
          {columns.map((col, key) => {
            const { sizes, blocks } = col

            return (
              <div
                key={key}
                className={cx(
                  sizes?.map((size) =>
                    getGridSize(
                      size.breakpoint,
                      size.width,
                      size.justify,
                      size.align,
                      size.start
                    )
                  )
                )}
              >
                {blocks?.map((block, key) => (
                  <GridBlock key={key} block={block} />
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

type GridBlockProps = {
  block: API['GridColumnBlock']
}
const GridBlock = ({ block }: GridBlockProps) => {
  const type = block?._type

  switch (type) {
    case 'freeform':
      return <Freeform data={block as SanityKeyed<FreeformType>} />
    case 'accordions':
      return <Accordions data={block as API['Accordions']} />
    case 'productCard':
      const productBlock = block as API['GridColumnProductBlock']
      return (
        productBlock.product && (
          <ProductCard
            className="is-inline"
            product={productBlock.product}
            hasVisuals
            showThumbs
            showPrice
          />
        )
      )
    default:
      return null
  }
}

export default Grid
