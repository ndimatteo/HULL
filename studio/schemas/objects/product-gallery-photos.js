import { Stack } from 'phosphor-react'

import customImage from '../../lib/custom-image'

export default {
  title: 'Gallery',
  name: 'productGalleryPhotos',
  type: 'object',
  icon: Stack,
  fields: [
    {
      title: 'Which Variants is this for?',
      name: 'forOption',
      type: 'string',
      options: {
        list: [{ title: 'All', value: '' }],
        from: 'options',
        fromData: { title: 'name' },
        joinWith: 'values'
      }
    },
    {
      title: 'Gallery Photo(s)',
      name: 'photos',
      type: 'array',
      of: [customImage()],
      options: {
        layout: 'grid'
      }
    }
  ],
  preview: {
    select: {
      photos: 'photos',
      forOption: 'forOption'
    },
    prepare({ photos, forOption }) {
      const option = forOption ? forOption.split(':') : null
      return {
        title:
          option && option.length > 1
            ? `${option[0]}: ${option[1]}`
            : 'All Variants',
        media: photos ? photos[0] : null
      }
    }
  }
}
