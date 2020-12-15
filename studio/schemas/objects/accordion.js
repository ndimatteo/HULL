import { FiMaximize2 } from 'react-icons/fi'

export default {
  title: 'Accordion',
  name: 'accordion',
  type: 'object',
  icon: FiMaximize2,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Content',
      name: 'content',
      type: 'simplePortableText'
    }
  ],
  preview: {
    select: {
      title: 'title'
    }
  }
}
