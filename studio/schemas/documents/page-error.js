import { FiAlertOctagon } from 'react-icons/fi'

export default {
  title: 'Error Page',
  name: 'errorPage',
  type: 'document',
  icon: FiAlertOctagon,
  __experimental_actions: ['update', 'publish'], // disable for initial publish
  fields: [
    {
      title: 'Page Modules',
      name: 'modules',
      type: 'array',
      of: [{ type: 'grid' }, { type: 'marquee' }]
    },
    {
      title: 'SEO / Share Settings',
      name: 'seo',
      type: 'seo'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Error Page'
      }
    }
  }
}
