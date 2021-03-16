import React from 'react'
import cx from 'classnames'

import { hasObject } from '@lib/helpers'
import Swatch from '@components/swatch'

const ProductOption = ({
  option,
  optionSettings,
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

          const optSettings = optionSettings?.find((settings) => {
            const optName = settings.forOption.split(':')[0]
            const optValue = settings.forOption.split(':')[1]
            return optName === option.name && optValue === value
          })

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

          return (
            <li
              key={key}
              className={cx({
                'is-active': isActive,
                'is-unavailable': !hasVariants,
                'is-soldout': !inStock && hasVariants && !isActive,
              })}
            >
              {optSettings?.color ? (
                <button
                  onClick={() =>
                    !isActive &&
                    changeOption(
                      option.name,
                      value,
                      variants,
                      activeVariant,
                      onChange
                    )
                  }
                  className="option--swatch"
                >
                  <Swatch
                    label={`Select "${value}" ${option.name} option`}
                    color={optSettings?.color}
                  />
                </button>
              ) : (
                <button
                  onClick={() =>
                    !isActive &&
                    changeOption(
                      option.name,
                      value,
                      variants,
                      activeVariant,
                      onChange
                    )
                  }
                  className="btn is-block"
                >
                  {value}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// handle option changes
const changeOption = (name, value, variants, activeVariant, changeCallback) => {
  const newOptions = activeVariant.options.map((opt) =>
    opt.name === name ? { ...opt, value: value } : opt
  )

  const newVariant = variants.find((variant) =>
    variant.options.every((opt) => hasObject(newOptions, opt))
  )

  if (newVariant && changeCallback) {
    changeCallback(newVariant)
  }
}

export default ProductOption
