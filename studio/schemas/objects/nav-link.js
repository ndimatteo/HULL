import { FiExternalLink } from 'react-icons/fi'

export default {
  title: 'Link',
  name: 'navLink',
  type: 'object',
  icon: FiExternalLink,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'Display Text'
    },
    {
      title: 'URL',
      name: 'url',
      type: 'url',
      description: 'enter an external URL'
    }
  ],
  preview: {
    select: {
      title: 'title',
      url: 'url'
    },
    prepare({ title, url }) {
      return {
        title: title,
        subtitle: url
      }
    }
  }
}
