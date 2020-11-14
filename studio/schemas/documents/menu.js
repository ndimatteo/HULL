import { FiMenu } from 'react-icons/fi'

export default {
  title: 'Menu',
  name: 'menu',
  type: 'document',
  icon: FiMenu,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'required',
      options: {
        source: 'title',
        maxLength: 30
      }
    },
    {
      title: 'Nav Items',
      name: 'items',
      type: 'array',
      of: [{ type: 'navPage' }, { type: 'navLink' }, { type: 'navDropdown' }]
    }
  ]
}
