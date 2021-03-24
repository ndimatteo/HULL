import { FiImage } from 'react-icons/fi'

export default {
  title: 'Divider Photo',
  name: 'dividerPhoto',
  type: 'object',
  icon: FiImage,
  fields: [
    {
      title: 'Photo',
      name: 'photo',
      type: 'figure'
    }
  ],
  preview: {
    select: {
      photo: 'photo'
    },
    prepare({ photo }) {
      return {
        title: 'Divider Photo',
        media: photo
      }
    }
  }
}
