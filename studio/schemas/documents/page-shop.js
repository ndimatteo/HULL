import { FiShoppingCart } from 'react-icons/fi'

export default {
  title: 'Shop All Page',
  name: 'shopPage',
  type: 'document',
  icon: FiShoppingCart,
  fields: [
    // Place other Fields here
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'SEO / Share Settings',
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
