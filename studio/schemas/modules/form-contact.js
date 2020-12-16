import { FiMail } from 'react-icons/fi'
import Notice from '../../components/notice'

export default {
  title: 'Contact Form',
  name: 'formContact',
  type: 'object',
  icon: FiMail,
  fields: [
    {
      type: 'string',
      name: 'apiNotice',
      inputComponent: Notice,
      value: `
        <p><strong>Gotcha:</strong> You must have a SendGrid API Key added to your Vercel Environment Variables for this form to work.</p>
      `
    },
    {
      title: 'Form Name',
      name: 'formName',
      type: 'string',
      description: 'Internal form name.'
    },
    {
      title: 'Sender Email Address',
      name: 'fromAddress',
      type: 'string',
      description: 'Verified SendGrid email address to use as sender.',
      validation: Rule => Rule.required()
    },
    {
      title: 'Notifications',
      name: 'notificationEmails',
      type: 'string',
      description:
        'The email address where you’d like to receive notifications when a user fills out this form (use a comma separated list to send to multiple addresses).',
      validation: Rule => Rule.required()
    },
    {
      title: 'SendGrid Template ID',
      name: 'templateID',
      type: 'string',
      description: 'The template ID to use for notification emails.',
      validation: Rule => Rule.required()
    },
    {
      type: 'string',
      name: 'templateTips',
      inputComponent: Notice,
      value: `
        <p><strong>Tip:</strong> Use the following variables in your SendGrid template to display data:</p>
        <p><code>{{formName}}</code> - Display the internal form name</p>
        <p><code>{{subject}}</code> - Display the subject field value</p>
        <p><code>{{name}}</code> - Display the name field value</p>
        <p><code>{{email}}</code> - Display the email field value</p>
        <p><code>{{message}}</code> - Display the message field value</p>
      `
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
    }
  ],
  preview: {
    select: {
      formName: 'formName'
    },
    prepare({ formName }) {
      return {
        title: formName || 'Contact Form'
      }
    }
  }
}
