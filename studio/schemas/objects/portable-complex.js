// import '../../branding/skin.css?raw'

import {
  Header1,
  Header2,
  Header3,
  Header4,
  Button
} from '../../components/block-renders'

import ConditionalFields from '../../components/conditional-field'

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
              },
              {
                name: 'styles',
                type: 'object',
                inputComponent: ConditionalFields,
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
                    }
                  },
                  {
                    title: 'Full Width',
                    name: 'isBlock',
                    type: 'boolean',
                    options: {
                      layout: 'checkbox'
                    }
                  }
                ],
                options: {
                  condition: (document, context) => context().isButton === true
                }
              }
            ]
          }
        ]
      }
    },
    {
      type: 'figure'
    },
    {
      type: 'horizontalRule'
    }
  ]
}
