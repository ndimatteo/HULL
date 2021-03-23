import React from 'react'
import { FiSliders, FiHelpCircle } from 'react-icons/fi'
import { Avatar } from '@sanity/ui'

// import Note from '@components/note'

export default {
  title: 'Column Size',
  name: 'gridSize',
  type: 'object',
  icon: FiSliders,
  fieldsets: [
    {
      title: '',
      name: 'sizes',
      options: { columns: 2 }
    }
  ],
  fields: [
    {
      name: 'gridNote',
      type: 'note',
      options: {
        icon: FiHelpCircle,
        headline: 'What’s this',
        message: `The "Width" and "Start" fields correlate with the "Grid Size" set for this Grid module. For example, say you have an 8 column grid: Setting a column width of 4 would make a 50% width column, while a start column of 5 would make it start 50% in (the 5th column of the 8-column grid).`
      }
    },
    {
      title: 'Breakpoint',
      name: 'breakpoint',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: ' ' },
          { title: 'XS', value: 'xs' },
          { title: 'SM', value: 'sm' },
          { title: 'MD', value: 'md' },
          { title: 'LG', value: 'lg' },
          { title: 'XL', value: 'xl' }
        ]
      },
      validation: Rule => Rule.required(),
      fieldset: 'sizes'
    },
    {
      title: 'Width',
      name: 'width',
      type: 'number',
      options: {
        list: [
          { title: '1', value: 1 },
          { title: '2', value: 2 },
          { title: '3', value: 3 },
          { title: '4', value: 4 },
          { title: '5', value: 5 },
          { title: '6', value: 6 },
          { title: '7', value: 7 },
          { title: '8', value: 8 },
          { title: '9', value: 9 },
          { title: '10', value: 10 },
          { title: '11', value: 11 },
          { title: '12', value: 12 }
        ]
      },
      validation: Rule => Rule.required(),
      fieldset: 'sizes'
    },
    {
      title: 'Justify',
      name: 'justify',
      type: 'string',
      description: 'Control the X-axis positioning',
      options: {
        list: [
          { title: 'Left', value: 'justify-self-start' },
          { title: 'Center', value: 'justify-self-center' },
          { title: 'Right', value: 'justify-self-end' }
        ]
      },
      fieldset: 'sizes'
    },
    {
      title: 'Align',
      name: 'align',
      type: 'string',
      description: 'Control the Y-axis positioning',
      options: {
        list: [
          { title: 'Top', value: 'self-start' },
          { title: 'Middle', value: 'self-center' },
          { title: 'Bottom', value: 'self-end' }
        ]
      },
      fieldset: 'sizes'
    },
    {
      title: 'Start (offset)',
      name: 'start',
      type: 'number',
      options: {
        list: [
          { title: '1', value: 1 },
          { title: '2', value: 2 },
          { title: '3', value: 3 },
          { title: '4', value: 4 },
          { title: '5', value: 5 },
          { title: '6', value: 6 },
          { title: '7', value: 7 },
          { title: '8', value: 8 },
          { title: '9', value: 9 },
          { title: '10', value: 10 },
          { title: '11', value: 11 },
          { title: '12', value: 12 }
        ]
      },
      fieldset: 'sizes'
    }
  ],
  preview: {
    select: {
      breakpoint: 'breakpoint',
      width: 'width',
      offset: 'offset'
    },
    prepare({ breakpoint, width, offset }) {
      return {
        title: `Grid width: ${width}`,
        subtitle: offset ? `offset: ${offset}` : null,
        media: (
          <Avatar
            initials={breakpoint && breakpoint.trim() ? breakpoint : 'D'}
            size={1}
          />
        )
      }
    }
  }
}
