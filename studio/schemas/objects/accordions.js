import { FiMaximize2 } from 'react-icons/fi'

export default {
  title: 'Accordion List',
  name: 'accordions',
  type: 'object',
  icon: FiMaximize2,
  fields: [
    {
      title: 'Accordions',
      name: 'items',
      type: 'array',
      of: [{ type: 'accordion' }]
    }
  ],
  preview: {
    select: {
      items: 'items'
    },
    prepare({ items }) {
      return {
        title: 'Accordion List',
        subtitle: `${items.length} item(s)`
      }
    }
  }
}
