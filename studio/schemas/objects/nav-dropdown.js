export default {
  title: 'Dropdown',
  name: 'navDropdown',
  type: 'object',
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'Text to Display'
    },
    {
      title: 'Dropdown Items',
      name: 'dropdownItems',
      type: 'array',
      of: [{ type: 'navPage' }, { type: 'navLink' }]
    }
  ]
}
