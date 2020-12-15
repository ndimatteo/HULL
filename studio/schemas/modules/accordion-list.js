import { FiMaximize2 } from 'react-icons/fi'

export default {
  title: 'Accordion List',
  name: 'accordionList',
  type: 'object',
  icon: FiMaximize2,
  fields: [
    {
      title: 'Section Title',
      name: 'title',
      type: 'string',
      description: 'Display a section title above the content'
    },
    {
      title: 'Accordions',
      name: 'items',
      type: 'array',
      of: [{ type: 'accordion' }]
    }
  ],
  preview: {
    select: {
      title: 'title'
    },
    prepare({ title }) {
      return {
        title: title || 'Accordion List'
      }
    }
  }
}
