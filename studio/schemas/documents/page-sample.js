import { FiMusic } from 'react-icons/fi'

export default {
  title: 'Home',
  name: 'samplePage',
  type: 'document',
  __experimental_actions: ['update', 'publish'], // disable for initial publish
  icon: FiMusic,
  fields: [
    // Place other Fields here
    {
      title: 'Carousel Photos',
      name: 'carousel',
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
  ]
}
