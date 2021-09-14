import { TextAlignLeft, Question } from 'phosphor-react'

import { getTypeTitles } from '../../lib/helpers'

export default {
  title: 'Content Grid',
  name: 'grid',
  type: 'object',
  icon: TextAlignLeft,
  fields: [
    {
      name: 'gridNote',
      type: 'note',
      options: {
        icon: Question,
        headline: 'How to setup a Grid',
        message: `Grids are first defined by the number of "spaces" they should have. Visually, you can think of this like available cells in a spreadsheet or table. Then, we define the columns that should exist within this grid, and what "space(s)" they should occupy at different screen sizes.`
      }
    },
    {
      title: 'Grid Size',
      name: 'size',
      type: 'number',
      description:
        'Set the default number of column spaces available for this grid',
      options: {
        list: [
          { title: '1', value: 1 },
          { title: '2', value: 2 },
          { title: '3', value: 3 },
          { title: '4', value: 4 },
          { title: '5', value: 5 },
          { title: '6', value: 6 },
          { title: '7', value: 7 },
          { title: '8', value: 8 },
          { title: '9', value: 9 },
          { title: '10', value: 10 },
          { title: '11', value: 11 },
          { title: '12', value: 12 }
        ]
      },
      validation: Rule => Rule.required(),
      initialValue: 12
    },
    {
      title: 'Columns',
      name: 'columns',
      type: 'array',
      of: [{ type: 'gridColumn' }],
      description: 'The columns that are part of this grid'
    }
  ],
  preview: {
    select: {
      columns: 'columns'
    },
    prepare({ columns }) {
      const name = getTypeTitles(columns.map(col => col.blocks[0]._type))

      const image = (columns[0].blocks[0].content || []).find(
        block => block._type === 'photo'
      )

      return {
        title: `${columns.length} Column${columns.length > 1 ? 's' : ''}`,
        subtitle: name,
        media: image
      }
    }
  }
}
