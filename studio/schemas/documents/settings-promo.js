export default {
  title: 'Promo Bar Settings',
  name: 'promoSettings',
  type: 'document',
  __experimental_actions: ['update', 'publish'], // disable for initial publish
  fields: [
    {
      title: 'Display',
      name: 'display',
      type: 'string',
      options: {
        list: [
          { title: 'Never', value: ' ' },
          { title: 'All Pages', value: 'all' },
          { title: 'Home Page only', value: 'home' }
        ]
      },
      description: 'Choose where the promo bar is displayed'
    },
    {
      title: 'Text',
      name: 'text',
      type: 'string',
      description: 'The text to show on the banner'
    },
    {
      title: 'Link',
      name: 'link',
      type: 'reference',
      to: [
        { type: 'homePage' },
        { type: 'shopPage' },
        { type: 'page' },
        { type: 'collection' },
        { type: 'product' }
      ],
      description: '(optional) Select a page to link the promo banner to'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Promo Bar Settings'
      }
    }
  }
}
