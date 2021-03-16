import React from 'react'
import cx from 'classnames'

import Freeform from '@blocks/freeform'

const Grid = ({ data = {} }) => {
  const { size, columns } = data

  const getGridSize = (breakpoint, size, start = false) => {
    const hasBreakpoint = breakpoint && breakpoint.trim()
    const colSpan = hasBreakpoint
      ? `${breakpoint}:col-span-${size}`
      : `col-span-${size}`
    const colStart = hasBreakpoint
      ? `${breakpoint}:col-start-${start}`
      : `col-start-${start}`

    return cx(colSpan, start && colStart)
  }

  return (
    <section className="section">
      <div className="section--content">
        <div className={`grid grid-cols-${size}`}>
          {columns.map((col, key) => {
            const { sizes, blocks } = col

            return (
              <div
                key={key}
                className={cx(
                  sizes.map((size) =>
                    getGridSize(size.breakpoint, size.width, size.start)
                  )
                )}
              >
                {blocks.map((block, key) => (
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

const GridBlock = ({ block }) => {
  const type = block._type

  switch (type) {
    case 'freeform':
      return <Freeform data={block} />
    default:
      return null
  }
}

export default Grid
