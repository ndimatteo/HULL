import { FiFileText } from 'react-icons/fi'

export default {
  title: 'Text',
  name: 'textBlock',
  type: 'object',
  icon: FiFileText,
  fields: [
    {
      title: 'Content',
      name: 'content',
      type: 'complexPortableText'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Text Block'
      }
    }
  }
}
