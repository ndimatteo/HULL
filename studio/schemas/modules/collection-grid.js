import { SquaresFour } from 'phosphor-react'

export default {
  title: 'Collection Grid',
  name: 'collectionGrid',
  type: 'object',
  icon: SquaresFour,
  fields: [
    {
      title: 'Display Collection Grid?',
      name: 'active',
      type: 'boolean',
      initialValue: true
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Collection Grid',
        subtitle: 'Displays the Collections’s associated products'
      }
    }
  }
}
