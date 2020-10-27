import { FiShoppingCart } from 'react-icons/fi'

export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: FiShoppingCart,
  fields: [
    {
      title: 'Shopify Product ID',
      name: 'shopifyID',
      type: 'string'
    },
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'URL Slug',
      name: 'slug',
      type: 'slug',
      description: '(required)',
      options: {
        source: 'title',
        maxLength: 96
      }
    },
    {
      title: 'SEO',
      name: 'seo',
      type: 'seo'
    }
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug',
      media: 'hero'
    },
    prepare({ title = 'Untitled', slug = {}, media }) {
      const path = `/${slug.current}`
      return {
        title,
        media,
        subtitle: slug.current ? path : '(missing slug)'
      }
    }
  }
}
