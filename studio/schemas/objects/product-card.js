import { Gift } from 'phosphor-react'

export default {
  title: 'Product Card',
  name: 'productCard',
  type: 'object',
  icon: Gift,
  fields: [
    {
      title: 'Product',
      name: 'product',
      type: 'reference',
      to: [{ type: 'product' }]
    }
  ],
  preview: {
    select: {
      title: 'product.title'
    },
    prepare({ title }) {
      return {
        title: title || 'Product Card'
      }
    }
  }
}
