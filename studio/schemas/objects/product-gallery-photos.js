import { FiLayers } from 'react-icons/fi'

export default {
  title: 'Gallery',
  name: 'productGalleryPhotos',
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
      title: 'Gallery Photo(s)',
      name: 'photos',
      type: 'array',
      of: [{ type: 'figure' }],
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
