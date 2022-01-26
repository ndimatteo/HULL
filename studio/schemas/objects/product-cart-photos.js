import { Stack } from 'phosphor-react'

import customImage from '../../lib/custom-image'

export default {
  title: 'Cart Photos',
  name: 'productCartPhotos',
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
    customImage({
      title: 'Thumbnail',
      name: 'cartPhoto'
    })
  ],
  preview: {
    select: {
      cartPhoto: 'cartPhoto',
      forOption: 'forOption'
    },
    prepare({ cartPhoto, forOption }) {
      const option = forOption ? forOption.split(':') : null
      return {
        title:
          option && option.length > 1
            ? `${option[0]}: ${option[1]}`
            : 'All Variants',
        media: cartPhoto ? cartPhoto : null
      }
    }
  }
}
