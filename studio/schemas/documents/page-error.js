import { FiAlertOctagon } from 'react-icons/fi'

export default {
  title: 'Error Page',
  name: 'errorPage',
  type: 'document',
  __experimental_actions: ['update', 'publish'], // disable for initial publish
  icon: FiAlertOctagon,
  fields: [
    // Place other Fields here
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
