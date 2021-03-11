export default {
  title: 'Footer Settings',
  name: 'footerSettings',
  type: 'document',
  __experimental_actions: ['update', 'publish'], // disable for initial publish
  fields: [
    {
      title: 'Columns',
      name: 'columns',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'menu' }]
        },
        { type: 'freeform' }
      ]
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Footer Settings'
      }
    }
  }
}
