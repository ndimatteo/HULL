import { FiAlignLeft } from 'react-icons/fi'

export default {
  title: 'Freeform',
  name: 'freeform',
  type: 'object',
  icon: FiAlignLeft,
  fields: [
    {
      title: 'Content',
      name: 'content',
      type: 'complexPortableText'
    },
    {
      title: 'Max-Width',
      name: 'maxWidth',
      type: 'string',
      description:
        'Improve legibility by adding a max-width to prevent long lines of text on larger screen sizes',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'XS (20rem)', value: 'xs' },
          { title: 'SM (24rem)', value: 'sm' },
          { title: 'MD (28rem)', value: 'md' },
          { title: 'LG (32rem)', value: 'lg' },
          { title: 'XL (36rem)', value: 'xl' },
          { title: '2XL (42rem)', value: '2xl' },
          { title: '3XL (48rem)', value: '3xl' },
          { title: '4XL (56rem)', value: '4xl' }
        ]
      }
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
