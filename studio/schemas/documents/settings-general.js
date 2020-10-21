export default {
  title: 'General Settings',
  name: 'generalSettings',
  type: 'document',
  __experimental_actions: ['update', 'publish'], // disable for initial publish
  fields: [
    {
      title: 'Marquee Text',
      name: 'marqueeText',
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
