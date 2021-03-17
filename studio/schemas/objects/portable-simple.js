import '../../branding/skin.css?raw'

import { Button } from '../../components/block-renders'

export default {
  title: 'Portable Text',
  name: 'simplePortableText',
  type: 'array',
  of: [
    {
      title: 'Block',
      type: 'block',
      styles: [{ title: 'Paragraph', value: 'normal' }],
      lists: [],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' }
        ],
        annotations: [
          {
            title: 'Link',
            name: 'link',
            type: 'object',
            blockEditor: {
              render: Button
            },
            fields: [
              {
                title: '(A) Internal Page',
                name: 'page',
                type: 'reference',
                to: [
                  { type: 'homePage' },
                  { type: 'shopPage' },
                  { type: 'page' },
                  { type: 'collection' },
                  { type: 'product' }
                ]
              },
              {
                title: '(B) External URL',
                name: 'url',
                type: 'url'
              },
              {
                title: 'Style as Button?',
                name: 'isButton',
                type: 'boolean'
              }
            ]
          }
        ]
      }
    }
  ]
}
