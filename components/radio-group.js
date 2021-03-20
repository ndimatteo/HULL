import React, { createContext, useContext } from 'react'
import flattenChildren from 'react-keyed-flatten-children'

// Create radio contexts
const RadioGroupContext = createContext()
const RadioItemContext = createContext()

// Export radio context hooks
export const useRadioGroupContext = () => useContext(RadioGroupContext)
export const useRadioItemContext = () => useContext(RadioItemContext)

export default function RadioGroup({
  value,
  onChange = () => {},
  children,
  className,
  ...props
}) {
  const items = flattenChildren(children)

  return (
    <RadioGroupContext.Provider value={{ value, items, onChange }}>
      <div role="radiogroup" className={className} {...props}>
        {items.map((child, index) => (
          <RadioItemContext.Provider key={index} value={index}>
            {child}
          </RadioItemContext.Provider>
        ))}
      </div>
    </RadioGroupContext.Provider>
  )
}
