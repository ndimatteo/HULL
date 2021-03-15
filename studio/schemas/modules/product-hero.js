import { FiShoppingBag } from 'react-icons/fi'

export default {
  title: 'Product Hero',
  name: 'productHero',
  type: 'object',
  icon: FiShoppingBag,
  fields: [
    {
      title: 'Display Product Hero?',
      name: 'active',
      type: 'boolean'
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
