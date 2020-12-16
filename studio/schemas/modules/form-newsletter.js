import { FiSend } from 'react-icons/fi'
import Notice from '../../components/notice'

export default {
  title: 'Newsletter Form',
  name: 'formNewsletter',
  type: 'object',
  icon: FiSend,
  fields: [
    {
      type: 'string',
      name: 'apiNotice',
      inputComponent: Notice,
      value: `
        <p><strong>Gotcha:</strong> You must have a Klaviyo Private API Key added to your Vercel Environment Variables for this form to work.</p>
      `
    },
    {
      title: 'Klaviyo List ID',
      name: 'klaviyoListID',
      type: 'string',
      description: 'Your Klaviyo List to subscribe emails to.',
      validation: Rule => Rule.required()
    },
    {
      title: 'Submit Text',
      name: 'submit',
      type: 'string'
    },
    {
      title: 'Success Message',
      name: 'successMsg',
      type: 'complexPortableText'
    },
    {
      title: 'Error Message',
      name: 'errorMsg',
      type: 'complexPortableText'
    },
    {
      title: 'Agreement Statement',
      name: 'terms',
      type: 'simplePortableText'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Newsletter Form'
      }
    }
  }
}
