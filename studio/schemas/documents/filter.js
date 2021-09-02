import React from 'react'
import { Sliders, CheckSquare, Lightning } from 'phosphor-react'

import { getSwatch } from '../../lib/helpers'

export const getIcon = (type, color) => {
  switch (type) {
    case 'swatch':
      return getSwatch(color)
    case 'dynamic':
      return <Lightning />
    default:
      return <CheckSquare />
  }
}

export default {
  title: 'Filter',
  name: 'filter',
  type: 'document',
  icon: () => <Sliders />,
  fields: [
    {
      title: 'Filter Type',
      name: 'type',
      type: 'string',
      options: {
        list: [
          { title: 'Simple', value: ' ' },
          { title: 'Swatch', value: 'swatch' }
        ]
      },
      initialValue: ' '
    },
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      description: 'required',
      options: {
        source: 'title',
        maxLength: 30
      }
    },
    {
      title: 'Color',
      name: 'color',
      type: 'reference',
      to: [{ type: 'solidColor' }],
      hidden: ({ parent }) => {
        return parent.type !== 'swatch'
      }
    }
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
      color: 'color.color'
    },
    prepare({ title = 'Untitled', type, color }) {
      const displayType = type && type.trim() ? type : 'simple'

      return {
        title,
        subtitle: displayType,
        media: getIcon(displayType, color?.hex.toUpperCase())
      }
    }
  }
}
