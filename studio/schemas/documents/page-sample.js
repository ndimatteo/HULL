import { FiMusic } from 'react-icons/fi'

export default {
  title: 'Home',
  name: 'samplePage',
  type: 'document',
  icon: FiMusic,
  fields: [
    // Place other Fields here
    {
      title: 'Carousel #1 Photos',
      name: 'carousel',
      type: 'array',
      of: [{ type: 'figure' }],
      options: {
        layout: 'grid'
      }
    },
    {
      title: 'Carousel #2 Photos',
      name: 'carousel2',
      type: 'array',
      of: [{ type: 'figure' }],
      options: {
        layout: 'grid'
      }
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
        title: 'Sample Page'
      }
    }
  }
}
