export default {
  title: 'SEO / Share Settings',
  name: 'seo',
  type: 'object',
  options: {
    collapsible: true
  },
  fields: [
    {
      title: 'Meta Title',
      name: 'metaTitle',
      type: 'string',
      description: 'Title used for search engines and browsers',
      validation: Rule =>
        Rule.max(50).warning('Longer titles may be truncated by search engines')
    },
    {
      title: 'Meta Description',
      name: 'metaDesc',
      type: 'text',
      rows: 3,
      description: 'Description for search engines',
      validation: Rule =>
        Rule.max(150).warning(
          'Longer descriptions may be truncated by search engines'
        )
    },
    {
      title: 'Share Title',
      name: 'shareTitle',
      type: 'string',
      description: 'Title used for social sharing cards',
      validation: Rule =>
        Rule.max(50).warning('Longer titles may be truncated by social sites')
    },
    {
      title: 'Share Description',
      name: 'shareDesc',
      type: 'text',
      rows: 3,
      description: 'Description used for social sharing cards',
      validation: Rule =>
        Rule.max(150).warning(
          'Longer descriptions may be truncated by social sites'
        )
    },
    {
      title: 'Share Graphic',
      name: 'shareGraphic',
      type: 'image',
      description: 'Recommended size: 1200x630 (PNG or JPG)'
    }
  ]
}
