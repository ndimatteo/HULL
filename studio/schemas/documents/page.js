import { format } from 'date-fns'
import { FiFile } from 'react-icons/fi'

export default {
  name: 'page',
  title: 'Page',
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
  // preview: {
  //   select: {
  //     title: 'title',
  //     publishedAt: 'publishedAt',
  //     slug: 'slug',
  //     media: 'mainImage'
  //   },
  //   prepare({ title = 'No title', publishedAt, slug = {}, media }) {
  //     const dateSegment = format(publishedAt, 'YYYY/MM')
  //     const path = `/${slug.current}`
  //     return {
  //       title,
  //       media,
  //       subtitle: publishedAt ? path : 'Missing publishing date'
  //     }
  //   }
  // }
}
