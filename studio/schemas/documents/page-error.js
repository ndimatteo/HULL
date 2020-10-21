import { FiAlertOctagon } from 'react-icons/fi'

export default {
  title: 'Error Page',
  name: 'errorPage',
  type: 'document',
  icon: FiAlertOctagon,
  __experimental_actions: ['update', 'publish'], // disable for initial publish
  fields: [
    {
      title: 'Browser Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Content',
      name: 'content',
      type: 'complexPortableText'
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
