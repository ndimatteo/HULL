export default {
  title: 'General Settings',
  name: 'generalSettings',
  type: 'document',
  fields: [
    {
      title: 'Live Site URL',
      description: 'The root domain or subdomain of your website.',
      name: 'siteURL',
      type: 'url'
    },
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
      title: 'Klaviyo Site ID (Public API Key)',
      description: 'For product waitlist and newsletter forms.',
      name: 'klaviyoAccountID',
      type: 'string'
    },
    {
      title: 'Social Links',
      name: 'social',
      type: 'array',
      of: [{ type: 'socialLink' }]
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'General Settings'
      }
    }
  }
}
