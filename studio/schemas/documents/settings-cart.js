export default {
  title: 'Cart Settings',
  name: 'cartSettings',
  type: 'document',
  __experimental_actions: ['update', 'publish'], // disable for initial publish
  fields: [
    {
      title: 'Shopify Checkout URL',
      description:
        'The custom domain or subdomain connected to your Shopify store.',
      name: 'storeURL',
      type: 'url',
      validation: Rule =>
        Rule.uri({
          scheme: ['https']
        })
    },
    {
      title: 'Cart Message',
      description: 'Display a message below the checkout button',
      name: 'message',
      type: 'string'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Cart Settings'
      }
    }
  }
}
