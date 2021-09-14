import { ShoppingBag } from 'phosphor-react'

export default {
  title: 'Product Hero',
  name: 'productHero',
  type: 'object',
  icon: ShoppingBag,
  fields: [
    {
      title: 'Display Product Hero?',
      name: 'active',
      type: 'boolean',
      initialValue: true
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Product Hero',
        subtitle: 'Displays the Product’s gallery and form'
      }
    }
  }
}
