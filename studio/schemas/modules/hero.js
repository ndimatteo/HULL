import { FiAward } from 'react-icons/fi'

export default {
  title: 'Hero',
  name: 'hero',
  type: 'object',
  icon: FiAward,
  fields: [
    {
      title: 'Hero Photo',
      name: 'photo',
      type: 'figure'
    }
  ],
  preview: {
    select: {
      media: 'photo'
    },
    prepare({ media }) {
      return {
        title: 'Hero',
        media
      }
    }
  }
}
