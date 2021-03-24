import React from 'react'
import { FiAlignLeft } from 'react-icons/fi'
import { Avatar } from '@sanity/ui'

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

      const type =
        block?._type &&
        block._type.charAt(0).toUpperCase() + block._type.slice(1)

      const preview = block?.content && block.content[0].children

      return {
        title: type || 'Column',
        subtitle: preview && preview[0]?.text,
        media: <Avatar initials={width} size={1} />
      }
    }
  }
}
