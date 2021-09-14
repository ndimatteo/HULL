import React from 'react'
import { Question } from 'phosphor-react'
import { Avatar } from '@sanity/ui'

export default {
  title: 'Column Size',
  name: 'gridSize',
  type: 'object',
  fieldsets: [
    {
      title: '',
      name: 'sizes',
      options: { columns: 2 }
    }
  ],
  fields: [
    {
      name: 'gridSizeNote',
      type: 'note',
      options: {
        icon: Question,
        headline: 'How to setup column sizes',
        message: (
          <>
            Always start with a "Default" breakpoint and work your way up.
            Visually, think about how many grid "spaces" you want your column to
            occupy at each breakpoint.
            <br />
            <br />
            You can also offset your column if you want it to have a gap in the
            grid spaces, just set the "space" you want the column to start in.
            <br />
            <br />
            The "Justify" and "Align" options can help position the column
            within the grid.
          </>
        )
      }
    },
    {
      title: 'Breakpoint',
      name: 'breakpoint',
      type: 'string',
      description: 'Control what screen width this is for',
      options: {
        list: [
          { title: 'Default', value: ' ' },
          { title: 'XS (480px and up)', value: 'xs' },
          { title: 'SM (768px and up)', value: 'sm' },
          { title: 'MD (940px and up)', value: 'md' },
          { title: 'LG (1200px and up)', value: 'lg' },
          { title: 'XL (1600px and up)', value: 'xl' }
        ]
      },
      validation: Rule => Rule.required(),
      fieldset: 'sizes'
    },
    {
      title: 'Width',
      name: 'width',
      type: 'number',
      description: 'Set how many grid spaces this occupies',
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
      description: 'Set the grid space this starts in',
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
      start: 'start'
    },
    prepare({ breakpoint, width, start }) {
      return {
        title: `Width: ${width}`,
        subtitle: start ? `Offset: ${start}` : null,
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
