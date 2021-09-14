import { Image } from 'phosphor-react'

import customImage from '../../lib/custom-image'

export default {
  title: 'Divider Photo',
  name: 'dividerPhoto',
  type: 'object',
  icon: Image,
  fields: [customImage()],
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
