import React from 'react'
import { hasObject } from '../../lib/helpers'

const ProductOption = ({
  option,
  position,
  variants,
  activeVariant,
  strictMatch = true,
  hideLabels,
  onChange,
}) => {
  const otherOpts = [
    ...activeVariant.options.slice(0, position),
    ...activeVariant.options.slice(position + 1),
  ]

  return (
    <div
      key={position}
      className={`option is-${option.name.toLowerCase().replace(' ', '-')}`}
    >
      {!hideLabels && <div className="option--title">{option.name}</div>}
      <ul className="option--values">
        {option.values.map((value, key) => {
          const currentOpt = [{ name: option.name, value: value }]

          const isActive = activeVariant.options.some(
            (opt) => opt.position === option.position && opt.value === value
          )

          const withActiveOptions = [...currentOpt, ...otherOpts]

          const hasVariants = variants.find((variant) =>
            variant.options.every((opt) => hasObject(withActiveOptions, opt))
          )

          const inStock = variants.find((variant) => {
            if (strictMatch) {
              return (
                variant.inStock &&
                variant.options.every((opt) =>
                  hasObject(withActiveOptions, opt)
                )
              )
            } else {
              return (
                variant.inStock &&
                variant.options.some((opt) => hasObject(currentOpt, opt))
              )
            }
          })

          const valueClasses = [
            isActive ? 'is-active' : '',
            !hasVariants ? 'is-unavailable' : '',
            !inStock && hasVariants && !isActive ? 'is-soldout' : '',
          ]

          return (
            <li key={key} className={valueClasses.filter(Boolean).join(' ')}>
              <button
                onClick={(e) => !isActive && onChange(e, option.name, value)}
                className="btn is-block"
              >
                {value}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ProductOption
