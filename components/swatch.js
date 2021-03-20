import React from 'react'
import { contrastColor } from 'contrast-color'

const Swatch = ({ label, color }) => {
  if (!color) return null

  return (
    <div
      className="swatch"
      aria-label={label}
      style={{
        '--swatchColor': color?.hex,
        '--swatchBorder': color?.hex
          ? contrastColor({ bgColor: color?.hex })
          : null,
      }}
    />
  )
}

export default Swatch
