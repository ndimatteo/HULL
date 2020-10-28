import { FiGift } from 'react-icons/fi'

export default {
  name: 'productVariant',
  title: 'Variant',
  type: 'document',
  __experimental_actions: ['update', 'publish', 'delete'], // disable for initial publish
  fieldsets: [
    {
      title: 'Shopify',
      name: 'shopify',
      description: 'Synced from Shopify',
      options: { columns: 2, collapsible: true }
    }
  ],
  icon: FiGift,
  fields: [
    {
      name: 'productTitle',
      title: 'Product Title',
      type: 'string',
      readOnly: true,
      fieldset: 'shopify'
    },
    {
      name: 'variantTitle',
      title: 'Variant Title',
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
      title: 'Price (cents)',
      type: 'number',
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
      title: 'SEO',
      name: 'seo',
      type: 'seo'
    }
  ],
  preview: {
    select: {
      variantTitle: 'variantTitle',
      title: 'title',
      productTitle: 'productTitle',
      media: 'hero'
    },
    prepare({
      variantTitle,
      title,
      productTitle = '(missing product)',
      media
    }) {
      return {
        title: title ? title : variantTitle,
        media,
        subtitle: productTitle
      }
    }
  }
}
