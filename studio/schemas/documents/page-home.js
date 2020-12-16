import { FiHome } from 'react-icons/fi'

export default {
  title: 'Home',
  name: 'homePage',
  type: 'document',
  icon: FiHome,
  fields: [
    // Place other Fields here
    {
      title: 'Content',
      name: 'content',
      type: 'array',
      of: [
        { type: 'textBlock' },
        { type: 'accordionList' },
        { type: 'formNewsletter' },
        { type: 'formContact' }
      ]
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
        title: 'Home Page'
      }
    }
  }
}
