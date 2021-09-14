import { PaperPlaneTilt } from 'phosphor-react'

export default {
  title: 'Newsletter Form',
  name: 'newsletter',
  type: 'object',
  icon: PaperPlaneTilt,
  fields: [
    {
      name: 'klaviyoNote',
      type: 'note',
      options: {
        headline: 'Gotcha',
        message:
          'You must have a Klaviyo Private API Key added to your Vercel Environment Variables for this form to work properly.',
        tone: 'caution'
      }
    },
    {
      title: 'Klaviyo List ID',
      name: 'klaviyoListID',
      type: 'string',
      description: 'Your Klaviyo List to subscribe emails to',
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
