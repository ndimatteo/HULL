import { FiRepeat } from 'react-icons/fi'

export default {
  title: 'Redirect',
  name: 'redirect',
  type: 'document',
  icon: FiRepeat,
  fields: [
    {
      title: 'From',
      name: 'from',
      type: 'string'
    },
    {
      title: 'To',
      name: 'to',
      type: 'string'
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
