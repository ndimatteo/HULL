import {
  useRef,
  useEffect,
  KeyboardEventHandler,
  DetailedHTMLProps,
  ButtonHTMLAttributes,
} from 'react'
import { wrap, Keys } from '@/lib/helpers'
import {
  useRadioGroupContext,
  useRadioItemContext,
} from '@/components/radio-group'

interface RadioItemProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  value: number
}

export default function RadioItem({
  value,
  children,
  ...rest
}: RadioItemProps) {
  const groupContext = useRadioGroupContext()
  const itemContext = useRadioItemContext()

  const isChecked = groupContext.value === value
  const itemRef = useRef<HTMLButtonElement>(null)
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    if (isChecked) {
      itemRef.current?.focus()
    }
  }, [isChecked])

  function handleClick() {
    groupContext.onChange(value)
  }

  const handleKeyDown: KeyboardEventHandler<HTMLButtonElement> = (ev) => {
    const { items, onChange } = groupContext
    const index = itemContext

    let flag = false

    // listen for one of our key presses
    switch (ev.keyCode) {
      case Keys.SPACE:
      case Keys.RETURN: {
        onChange(value)
        flag = true
        break
      }

      case Keys.UP:
      case Keys.LEFT: {
        // This cannot be correctly typed since items is an array of ReactChildren
        // @ts-ignore
        onChange(items[wrap(index - 1, items.length)].props.value)
        flag = true
        break
      }

      case Keys.DOWN:
      case Keys.RIGHT: {
        // This cannot be correctly typed since items is an array of ReactChildren
        // @ts-ignore
        onChange(items[wrap(index + 1, items.length)].props.value)
        flag = true
        break
      }

      default:
        break
    }

    // if one of our keys were pressed (flagged), prevent default behavior
    if (flag) {
      ev.stopPropagation()
      ev.preventDefault()
    }
  }

  return (
    <button
      ref={itemRef}
      role="radio"
      tabIndex={isChecked ? 0 : -1}
      aria-checked={isChecked}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </button>
  )
}
