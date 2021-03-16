import React from 'react'
import { FiSettings } from 'react-icons/fi'
import { FaCircle } from 'react-icons/fa'

const getSwatch = color => {
  return (
    <FaCircle
      color={color}
      style={{
        boxShadow: '0 0 0 1px rgba(255,255,255,.4)',
        borderRadius: '50%'
      }}
    />
  )
}

export default {
  title: 'option Settings',
  name: 'productOptionSettings',
  type: 'object',
  icon: FiSettings,
  fields: [
    {
      title: 'Wich option is this for?',
      name: 'forOption',
      type: 'string',
      options: {
        list: [{ title: 'All', value: '' }],
        fromField: 'options',
        fromSubField: 'values',
        fromFieldData: {
          title: 'name',
          value: 'position'
        }
      }
    },
    {
      title: 'Color Swatch',
      name: 'color',
      type: 'color',
      options: {
        disableAlpha: true
      },
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      color: 'color',
      forOption: 'forOption'
    },
    prepare({ color, forOption }) {
      const option = forOption ? forOption.split(':') : null
      return {
        title:
          option && option.length > 1
            ? `${option[0]}: ${option[1]}`
            : 'All Variants',
        media: color?.hex ? getSwatch(color.hex.toUpperCase()) : null
      }
    }
  }
}
