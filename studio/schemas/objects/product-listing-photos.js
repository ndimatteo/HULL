import { Stack } from 'phosphor-react'

import customImage from '../../lib/custom-image'

export default {
  title: 'Listing Photos',
  name: 'productListingPhotos',
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
      name: 'listingPhoto'
    }),
    customImage({
      title: 'Thumbnail (hover)',
      name: 'listingPhotoHover'
    })
  ],
  preview: {
    select: {
      listingPhoto: 'listingPhoto',
      forOption: 'forOption'
    },
    prepare({ listingPhoto, forOption }) {
      const option = forOption ? forOption.split(':') : null
      return {
        title:
          option && option.length > 1
            ? `${option[0]}: ${option[1]}`
            : 'All Variants',
        media: listingPhoto ? listingPhoto : null
      }
    }
  }
}
