import React from 'react'
import { FiAlignLeft } from 'react-icons/fi'
import { Avatar } from '@sanity/ui'

import { getTypeTitles, getTypeSubtitle } from '../../lib/helpers'

export default {
  title: 'Column',
  name: 'gridColumn',
  type: 'object',
  icon: FiAlignLeft,
  fields: [
    {
      title: 'Sizes',
      name: 'sizes',
      type: 'array',
      of: [{ type: 'gridSize' }],
      validation: Rule => Rule.required().min(1)
    },
    {
      title: 'Blocks',
      name: 'blocks',
      type: 'array',
      of: [
        { type: 'freeform' },
        { type: 'accordions' },
        { type: 'productCard' }
      ]
    }
  ],
  preview: {
    select: {
      sizes: 'sizes.0',
      block: 'blocks.0'
    },
    prepare({ sizes, block }) {
      const { width } = sizes

      const title = getTypeTitles([block._type])
      const subtitle = getTypeSubtitle(block)

      return {
        title: title || 'Block',
        subtitle: subtitle || '',
        media: <Avatar initials={width} size={1} />
      }
    }
  }
}
