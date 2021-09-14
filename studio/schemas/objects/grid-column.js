import React from 'react'
import { TextAlignLeft } from 'phosphor-react'
import { Avatar } from '@sanity/ui'

import { getTypeTitles } from '../../lib/helpers'

export default {
  title: 'Column',
  name: 'gridColumn',
  type: 'object',
  icon: TextAlignLeft,
  fields: [
    {
      title: 'Column Sizes',
      name: 'sizes',
      type: 'array',
      of: [{ type: 'gridSize' }],
      description:
        'Define the display size of this column for different screen widths',
      validation: Rule => Rule.required().min(1)
    },
    {
      title: 'Content Blocks',
      name: 'blocks',
      type: 'array',
      description: 'The content that exists inside this column',
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
      blocks: 'blocks'
    },
    prepare({ sizes, blocks }) {
      const { width } = sizes
      const types = blocks.map(block => block._type)

      const title = getTypeTitles(types)
      const subtitle = ''

      return {
        title: title || 'Block',
        subtitle: subtitle || '',
        media: <Avatar initials={width} size={1} />
      }
    }
  }
}
