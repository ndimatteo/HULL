import { CaretCircleDown } from 'phosphor-react'

export default {
  title: 'Accordion',
  name: 'accordion',
  type: 'object',
  icon: CaretCircleDown,
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
