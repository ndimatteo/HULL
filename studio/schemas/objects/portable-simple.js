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
                title: 'Link Type',
                name: 'linkType',
                type: 'string',
                options: {
                  list: [
                    { title: 'Internal Page', value: 'internal' },
                    { title: 'External URL', value: 'external' }
                  ],
                  layout: 'radio',
                  direction: 'horizontal'
                },
                initialValue: 'internal',
                validation: Rule => Rule.required()
              },
              {
                title: 'Internal Page',
                name: 'page',
                type: 'reference',
                to: [
                  { type: 'page' },
                  { type: 'collection' },
                  { type: 'product' }
                ],
                hidden: ({ parent }) => parent.linkType !== 'internal'
              },
              {
                title: 'External URL',
                name: 'url',
                type: 'url',
                validation: Rule =>
                  Rule.uri({
                    scheme: ['http', 'https', 'mailto', 'tel']
                  }),
                hidden: ({ parent }) => parent.linkType !== 'external'
              },
              {
                title: 'Style as Button?',
                name: 'isButton',
                type: 'boolean',
                initialValue: false
              }
            ]
          }
        ]
      }
    }
  ]
}
