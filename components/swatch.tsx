import React from 'react'
import { contrastColor } from 'contrast-color'

type SwatchProps = {
  label?: string
  color: {
    hex: string
  }
}

const Swatch = ({ label, color }: SwatchProps) => {
  if (!color) return null

  return (
    <div
      className="swatch"
      aria-label={label}
      style={{
        // @ts-ignore
        '--swatchColor': color?.hex,
        '--swatchBorder': color?.hex
          ? contrastColor({ bgColor: color?.hex })
          : null,
      }}
    />
  )
}

export default Swatch
