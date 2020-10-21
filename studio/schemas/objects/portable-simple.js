import React from 'react'
import { FiDroplet } from 'react-icons/fi'

import '../../branding/skin.css?raw'

const statementRender = (props) => (
  <div className="is-statement">{props.children}</div>
)

const subheadRender = (props) => (
  <div className="is-subhead">{props.children}</div>
)

const highlightRender = (props) => (
  <span className={props.color}>{props.children}</span>
)

export default {
  title: 'Portable Text',
  name: 'simplePortableText',
  type: 'array',
  of: [
    {
      title: 'Block',
      type: 'block',
      // Styles let you set what your user can mark up blocks with. These
      // corrensponds with HTML tags, but you can set any title or value
      // you want and decide how you want to deal with it where you want to
      // use your content.
      styles: [
        { title: 'Normal', value: 'normal' },
        {
          title: 'Statement',
          value: 'statement',
          blockEditor: {
            render: statementRender,
          },
        },
        {
          title: 'Subhead',
          value: 'subhead',
          blockEditor: {
            render: subheadRender,
          },
        },
      ],
      lists: [],
      // Marks let you mark up inline text in the block editor.
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting by editors.
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            title: 'Highlight',
            name: 'highlight',
            type: 'object',
            blockEditor: {
              icon: FiDroplet,
              render: highlightRender,
            },
            fields: [
              {
                title: 'Color',
                name: 'color',
                type: 'string',
                options: {
                  list: [
                    { title: 'Blue', value: 'is-blue' },
                    { title: 'Navy', value: 'is-navy' },
                    { title: 'Teal', value: 'is-teal' },
                    { title: 'Sky Blue', value: 'is-skyblue' },
                  ],
                  layout: 'radio',
                },
              },
            ],
          },
        ],
      },
    },
  ],
}
