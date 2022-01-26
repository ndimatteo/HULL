import {
  Header1,
  Header2,
  Header3,
  Header4,
  Button
} from '../../components/block-renders'

import customImage from '../../lib/custom-image'

export default {
  title: 'Rich Text',
  name: 'complexPortableText',
  type: 'array',
  of: [
    {
      title: 'Block',
      type: 'block',
      styles: [
        { title: 'Paragraph', value: 'normal' },
        {
          title: 'H1 (use once)',
          value: 'h1',
          blockEditor: {
            render: Header1
          }
        },
        {
          title: 'H1 (mimic)',
          value: 'h1mock',
          blockEditor: {
            render: Header1
          }
        },
        {
          title: 'H2',
          value: 'h2',
          blockEditor: {
            render: Header2
          }
        },
        {
          title: 'H2 (mimic)',
          value: 'h2mock',
          blockEditor: {
            render: Header2
          }
        },
        {
          title: 'H3',
          value: 'h3',
          blockEditor: {
            render: Header3
          }
        },
        {
          title: 'H3 (mimic)',
          value: 'h3mock',
          blockEditor: {
            render: Header3
          }
        },
        {
          title: 'H4',
          value: 'h4',
          blockEditor: {
            render: Header4
          }
        },
        {
          title: 'H4 (mimic)',
          value: 'h4mock',
          blockEditor: {
            render: Header4
          }
        }
      ],
      lists: [{ title: 'Bullet', value: 'bullet' }],
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
                  ]
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
              },
              {
                name: 'styles',
                type: 'object',
                fields: [
                  {
                    title: 'Button Style',
                    name: 'style',
                    type: 'string',
                    options: {
                      list: [
                        { title: 'Default', value: '' },
                        { title: 'Primary', value: 'is-primary' },
                        { title: 'White', value: 'is-white' }
                      ],
                      layout: 'radio'
                    }
                  },
                  {
                    title: 'Large Size',
                    name: 'isLarge',
                    type: 'boolean',
                    options: {
                      layout: 'checkbox'
                    },
                    initialValue: false
                  },
                  {
                    title: 'Full Width',
                    name: 'isBlock',
                    type: 'boolean',
                    options: {
                      layout: 'checkbox'
                    },
                    initialValue: false
                  }
                ],
                hidden: ({ parent }) => !parent.isButton
              }
            ]
          }
        ]
      }
    },
    customImage(),
    {
      type: 'horizontalRule'
    }
  ]
}
