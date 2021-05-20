import React, { createContext, useContext, ReactChild } from 'react'
import flattenChildren from 'react-keyed-flatten-children'

// Create radio contexts
const RadioGroupContext = createContext<{
  value: number | undefined
  items: ReactChild[]
  onChange: (value: number) => void
}>({
  value: 0,
  items: [],
  onChange: () => {},
})
const RadioItemContext = createContext(0)

// Export radio context hooks
export const useRadioGroupContext = () => useContext(RadioGroupContext)
export const useRadioItemContext = () => useContext(RadioItemContext)

interface RadioGroupProps {
  value: number | undefined
  onChange?: (value: number) => void
  className: string
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onChange = () => {},
  children,
  className,
  ...props
}) => {
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

export default RadioGroup
