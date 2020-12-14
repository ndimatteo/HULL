import { FiHome } from 'react-icons/fi'

export default {
  title: 'Home',
  name: 'homePage',
  type: 'document',
  icon: FiHome,
  fields: [
    // Place other Fields here
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Hero Photo',
      name: 'hero',
      type: 'figure'
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
        title: 'Home Page'
      }
    }
  }
}
