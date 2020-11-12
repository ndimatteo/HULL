import { FiShoppingCart } from 'react-icons/fi'

export default {
  title: 'Shop All Page',
  name: 'shopPage',
  type: 'document',
  __experimental_actions: ['update', 'publish'], // disable for initial publish
  icon: FiShoppingCart,
  fields: [
    // Place other Fields here
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'SEO',
      name: 'seo',
      type: 'seo'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Shop Page'
      }
    }
  }
}
