import React from 'react'
import { Gear } from 'phosphor-react'

import { getSwatch } from '../../lib/helpers'

export default {
  title: 'option Settings',
  name: 'productOptionSettings',
  type: 'object',
  icon: () => <Gear />,
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
      type: 'reference',
      to: [{ type: 'solidColor' }],
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      color: 'color.color',
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
