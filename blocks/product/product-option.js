import React from 'react'
import cx from 'classnames'

import { hasObject } from '@lib/helpers'
import RadioGroup from '@components/radio-group'
import RadioItem from '@components/radio-item'

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

      <RadioGroup
        value={
          activeVariant.options.find((opt) => opt.name === option.name).value
        }
        onChange={(value) =>
          changeOption(option.name, value, variants, activeVariant, onChange)
        }
        className="option--values"
      >
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
            <RadioItem
              key={key}
              value={value}
              className={cx({
                btn: !optSettings?.color,
                'option--swatch': optSettings?.color,
                'is-active': isActive,
                'is-unavailable': !hasVariants,
                'is-soldout': !inStock && hasVariants && !isActive,
              })}
            >
              {optSettings?.color ? (
                <Swatch
                  label={`Select "${value}" ${option.name} option`}
                  color={optSettings?.color}
                />
              ) : (
                <>{value}</>
              )}
            </RadioItem>
          )

          // return (
          //   <li key={key}>
          //     {optSettings?.color ? (
          //       <button
          //         role="radio"
          //         tabIndex={isActive ? 0 : -1}
          //         aria-checked={isActive}
          //         onClick={() =>
          //           !isActive &&
          //           changeOption(
          //             option.name,
          //             value,
          //             variants,
          //             activeVariant,
          //             onChange
          //           )
          //         }
          //         className={optionClassStates('option--swatch')}
          //       >
          //         <Swatch
          //           label={`Select "${value}" ${option.name} option`}
          //           color={optSettings?.color}
          //         />
          //       </button>
          //     ) : (
          //       <button
          //         role="radio"
          //         tabIndex={isActive ? 0 : -1}
          //         aria-checked={isActive}
          //         onClick={() =>
          //           !isActive &&
          //           changeOption(
          //             option.name,
          //             value,
          //             variants,
          //             activeVariant,
          //             onChange
          //           )
          //         }
          //         className={optionClassStates('btn is-block')}
          //       >
          //         {value}
          //       </button>
          //     )}
          //   </li>
          // )
        })}
      </RadioGroup>
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
