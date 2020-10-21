export default {
  title: 'Button',
  name: 'button',
  type: 'object',
  fields: [
    {
      title: 'Call to Action',
      name: 'cta',
      type: 'string',
    },
    {
      title: 'Page Link',
      name: 'page',
      type: 'reference',
      to: [{ type: 'page' }],
    },
    {
      title: 'Button Color',
      name: 'color',
      type: 'string',
      options: {
        list: [
          { title: 'Navy (default)', value: 'is-default' },
          { title: 'Blue (primary)', value: 'is-primary' },
          { title: 'Sky Blue (secondary)', value: 'is-secondary' },
        ],
        layout: 'radio',
      },
    },
  ],
}
