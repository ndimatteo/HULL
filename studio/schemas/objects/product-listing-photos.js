import { FiLayers } from 'react-icons/fi'

export default {
  title: 'Listing Photos',
  name: 'productListingPhotos',
  type: 'object',
  icon: FiLayers,
  fields: [
    {
      title: 'Wich Variants is this for?',
      name: 'forOption',
      type: 'string',
      options: {
        list: [{ title: 'All', value: '' }],
        fromField: 'options',
        fromSubField: 'values',
        fromFieldData: {
          title: 'name',
          value: 'position'
        }
      }
    },
    {
      title: 'Thumbnail',
      name: 'listingPhoto',
      type: 'figure'
    },
    {
      title: 'Thumbnail (hover)',
      name: 'listingPhotoHover',
      type: 'figure'
    }
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
