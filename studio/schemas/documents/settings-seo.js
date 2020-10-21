export default {
  title: 'Global SEO',
  name: 'seoSettings',
  type: 'document',
  __experimental_actions: ['update', 'publish'], // disable for initial publish
  fields: [
    {
      title: 'Site Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Description',
      name: 'description',
      type: 'text',
      description: 'Describe your site for search engines and social media.'
    },
    {
      title: 'Share Graphic',
      name: 'share',
      type: 'image',
      description:
        'recommended size: 1200x630, used when shared on social media.'
    },
    {
      title: 'Twitter Handle',
      name: 'handle',
      type: 'string'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Global SEO'
      }
    }
  }
}
