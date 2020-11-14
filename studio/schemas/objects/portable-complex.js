import React from 'react'
import { FiMousePointer } from 'react-icons/fi'

import '../../branding/skin.css?raw'

const statementRender = props => (
  <div className="is-statement">{props.children}</div>
)

const noteRender = props => <div className="is-note">{props.children}</div>

const importantRender = props => (
  <div className="is-important">{props.children}</div>
)

const buttonRender = props => (
  <span className={`btn ${props.color}`}>{props.children}</span>
)

export default {
  title: 'Rich Text',
  name: 'complexPortableText',
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
            render: statementRender
          }
        },
        {
          title: 'Note',
          value: 'note',
          blockEditor: {
            render: noteRender
          }
        },
        {
          title: 'Important',
          value: 'important',
          blockEditor: {
            render: importantRender
          }
        },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' }
      ],
      lists: [{ title: 'Bullet', value: 'bullet' }],
      // Marks let you mark up inline text in the block editor.
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting by editors.
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' }
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            title: 'Link',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'Page Link',
                name: 'page',
                type: 'reference',
                to: [
                  { type: 'homePage' },
                  { type: 'shopPage' },
                  { type: 'page' },
                  { type: 'collection' },
                  { type: 'product' },
                  { type: 'samplePage' }
                ]
              },
              {
                title: 'External URL',
                name: 'href',
                type: 'url'
              }
            ]
          },
          {
            title: 'Button',
            name: 'button',
            type: 'object',
            blockEditor: {
              icon: FiMousePointer,
              render: buttonRender
            },
            fields: [
              {
                title: 'Page Link',
                name: 'page',
                type: 'reference',
                to: [
                  { type: 'homePage' },
                  { type: 'shopPage' },
                  { type: 'page' },
                  { type: 'collection' },
                  { type: 'product' },
                  { type: 'samplePage' }
                ]
              },
              {
                title: 'External URL',
                name: 'href',
                type: 'url'
              },
              {
                title: 'Button Color',
                name: 'color',
                type: 'string',
                options: {
                  list: [
                    { title: 'Default', value: 'is-default' },
                    { title: 'Accented', value: 'is-accent' }
                  ],
                  layout: 'radio'
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
