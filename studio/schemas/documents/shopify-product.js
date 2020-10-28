import { FiShoppingCart } from 'react-icons/fi'

export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  __experimental_actions: ['update', 'publish', 'delete'], // disable for initial publish
  fieldsets: [
    {
      title: 'Shopify',
      name: 'shopify',
      options: { columns: 2, collapsible: true }
    }
  ],
  icon: FiShoppingCart,
  fields: [
    {
      name: 'productTitle',
      title: 'Product Title',
      type: 'string',
      readOnly: true,
      fieldset: 'shopify'
    },
    {
      name: 'productID',
      title: 'Product ID',
      type: 'number',
      readOnly: true,
      fieldset: 'shopify'
    },
    {
      name: 'variantID',
      title: 'Variant ID',
      type: 'number',
      readOnly: true,
      fieldset: 'shopify'
    },
    {
      name: 'price',
      title: 'Price',
      type: 'string',
      readOnly: true,
      fieldset: 'shopify'
    },
    {
      name: 'sku',
      title: 'SKU',
      type: 'string',
      readOnly: true,
      fieldset: 'shopify'
    },
    {
      title: 'Display Title',
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
      productTitle: 'productTitle',
      title: 'title',
      slug: 'slug',
      media: 'hero'
    },
    prepare({ productTitle, title, slug = {}, media }) {
      const path = `/${slug.current}`
      return {
        title: title ? title : productTitle,
        media,
        subtitle: slug.current ? path : '(missing slug)'
      }
    }
  }
}
