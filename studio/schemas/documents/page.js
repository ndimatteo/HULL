import { FiFile } from 'react-icons/fi'

export default {
  title: 'Page',
  name: 'page',
  type: 'document',
  icon: FiFile,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },
    {
      title: 'URL Slug',
      name: 'slug',
      type: 'slug',
      description: '(required)',
      options: {
        source: 'title',
        maxLength: 96
      }
    },
    {
      title: 'Hero Photo',
      name: 'hero',
      type: 'figure'
    },
    {
      title: 'Content',
      name: 'content',
      type: 'array',
      of: [
        { type: 'hero' },
        { type: 'textBlock' }
        // { type: 'venuesList' },
        // { type: 'eventsList' },
        // { type: 'formContact' },
        // { type: 'formNewsletter' },
        // { type: 'accordionList' },
      ]
    },
    {
      title: 'SEO',
      name: 'seo',
      type: 'seo'
    }
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug',
      media: 'hero'
    },
    prepare({ title = 'Untitled', slug = {}, media }) {
      const path = `/${slug.current}`
      return {
        title,
        media,
        subtitle: slug.current ? path : '(missing slug)'
      }
    }
  }
}
