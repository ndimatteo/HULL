import React from 'react'
import { Shuffle } from 'phosphor-react'

export default {
  title: 'Redirect',
  name: 'redirect',
  type: 'document',
  icon: () => <Shuffle />,
  fields: [
    {
      title: 'From',
      name: 'from',
      type: 'string',
      description:
        'Do not include the full domain or leading slash. For example: old-page'
    },
    {
      title: 'To',
      name: 'to',
      type: 'string',
      description:
        'Do not include the full domain or leading slash. For example: new-page'
    },
    {
      title: 'Is Permanent?',
      name: 'isPermanent',
      type: 'boolean'
    }
  ],
  initialValue: {
    isPermanent: true
  },
  preview: {
    select: {
      to: 'to',
      from: 'from',
      isPermanent: 'isPermanent'
    },
    prepare({ from, to, isPermanent }) {
      return {
        title: from && to ? `(${from}) → (${to})` : 'New Redirect',
        subtitle: isPermanent ? '301' : '302'
      }
    }
  }
}
