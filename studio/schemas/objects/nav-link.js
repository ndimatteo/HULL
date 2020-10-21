export default {
  title: 'Link',
  name: 'navLink',
  type: 'object',
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'Display Text',
    },
    {
      title: 'Link',
      name: 'link',
      type: 'url',
      description: 'enter an external URL',
    },
    {
      title: 'Style as Button?',
      name: 'isButton',
      type: 'boolean',
    },
  ],
}
