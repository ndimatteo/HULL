import { FiGift } from 'react-icons/fi'

export default {
  title: 'Collection Grid',
  name: 'collectionGrid',
  type: 'object',
  icon: FiGift,
  fields: [
    {
      title: 'Display Collection Grid?',
      name: 'active',
      type: 'boolean'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Collection Grid',
        subtitle: 'Displays the Collections’s associated products'
      }
    }
  }
}
