import React from 'react'
import { FiAlignLeft, FiMousePointer } from 'react-icons/fi'

import '../../branding/skin.css?raw'

const noteRender = props => <div className="is-note">{props.children}</div>

const alignRender = props => (
  <span className={props.alignment}>{props.children}</span>
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
      styles: [
        { title: 'Normal', value: 'normal' },
        {
          title: 'Note',
          value: 'note',
          blockEditor: {
            render: noteRender
          }
        },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' }
      ],
      lists: [{ title: 'Bullet', value: 'bullet' }],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' }
        ],
        annotations: [
          {
            title: 'Text Align',
            name: 'align',
            type: 'object',
            blockEditor: {
              icon: FiAlignLeft,
              render: alignRender
            },
            fields: [
              {
                title: 'Text Alignment',
                name: 'alignment',
                type: 'string',
                options: {
                  list: [
                    { title: 'Left', value: 'text-left' },
                    { title: 'Center', value: 'text-center' },
                    { title: 'Right', value: 'text-right' }
                  ],
                  layout: 'radio'
                }
              }
            ]
          },
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
                  { type: 'samplePage' },
                  { type: 'shopPage' },
                  { type: 'page' },
                  { type: 'collection' },
                  { type: 'product' }
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
                  { type: 'samplePage' },
                  { type: 'shopPage' },
                  { type: 'page' },
                  { type: 'collection' },
                  { type: 'product' }
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
