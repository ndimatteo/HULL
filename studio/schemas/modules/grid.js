import { FiGrid } from 'react-icons/fi'

const getBlockNames = types => {
  const typeNames = types.map(type => {
    switch (type) {
      case 'freeform':
        return 'Freeform'
      case 'accordions':
        return 'Accordions'
      default:
        return null
    }
  })

  return typeNames.join(' + ')
}

export default {
  title: 'Content Grid',
  name: 'grid',
  type: 'object',
  icon: FiGrid,
  fields: [
    {
      title: 'Grid Size',
      name: 'size',
      type: 'number',
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
      validation: Rule => Rule.required()
    },
    {
      title: 'Columns',
      name: 'columns',
      type: 'array',
      of: [{ type: 'gridColumn' }]
    }
  ],
  preview: {
    select: {
      columns: 'columns'
    },
    prepare({ columns }) {
      const name = getBlockNames(columns.map(col => col.blocks[0]._type))

      const image = (columns[0].blocks[0].content || []).find(
        block => block._type === 'figure'
      )

      return {
        title: `${columns.length} Column${columns.length > 1 ? 's' : ''}`,
        subtitle: name,
        media: image
      }
    }
  }
}
