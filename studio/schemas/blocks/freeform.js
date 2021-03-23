import { FiAlignLeft } from 'react-icons/fi'

export default {
  title: 'Freeform',
  name: 'freeform',
  type: 'object',
  icon: FiAlignLeft,
  fieldsets: [
    {
      title: '',
      name: 'blockOptions',
      options: { columns: 2 }
    }
  ],
  fields: [
    {
      title: ' ',
      name: 'content',
      type: 'complexPortableText'
    },
    {
      title: 'Max Width',
      name: 'maxWidth',
      type: 'string',
      description:
        'Apply a max-width to this block, inside the column (helps with legibility)',
      options: {
        list: [
          { title: 'None', value: ' ' },
          { title: 'Prose (optimal for text)', value: 'max-w-prose' },
          { title: 'XS (20rem)', value: 'max-w-xs' },
          { title: 'SM (24rem)', value: 'max-w-sm' },
          { title: 'MD (28rem)', value: 'max-w-md' },
          { title: 'LG (32rem)', value: 'max-w-lg' },
          { title: 'XL (36rem)', value: 'max-w-xl' },
          { title: '2XL (42rem)', value: 'max-w-2xl' },
          { title: '3XL (48rem)', value: 'max-w-3xl' },
          { title: '4XL (56rem)', value: 'max-w-4xl' },
          { title: '5XL (64rem)', value: 'max-w-5xl' },
          { title: '6XL (72rem)', value: 'max-w-6xl' },
          { title: '7XL (80rem)', value: 'max-w-7xl' }
        ]
      },
      fieldset: 'blockOptions'
    },
    {
      title: 'Text Alignment',
      name: 'textAlign',
      type: 'string',
      description:
        'Change the alignment of text (and other items) inside this block',
      options: {
        list: [
          { title: 'Left', value: 'text-start' },
          { title: 'Center', value: 'text-center' },
          { title: 'Right', value: 'text-end' },
          { title: 'Justify', value: 'text-justify' }
        ]
      },
      fieldset: 'blockOptions'
    }
  ],
  preview: {
    select: {
      content: 'content.0.children'
    },
    prepare({ content }) {
      return {
        title: 'Freeform',
        subtitle: content && content[0]?.text
      }
    }
  }
}
