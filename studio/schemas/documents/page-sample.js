import { FiHeart } from 'react-icons/fi'

export default {
  title: 'Sample Page',
  name: 'samplePage',
  type: 'document',
  icon: FiHeart,
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
      title: 'Demo Carousel #1',
      name: 'carousel',
      type: 'array',
      of: [{ type: 'figure' }],
      options: {
        layout: 'grid'
      }
    },
    {
      title: 'Demo Carousel #2',
      name: 'carousel2',
      type: 'array',
      of: [{ type: 'figure' }],
      options: {
        layout: 'grid'
      }
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
        title: 'Sample Page'
      }
    }
  }
}
