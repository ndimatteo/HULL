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
      options: { columns: 2, collapsible: true }
    }
  ],
  icon: FiGift,
  fields: [
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
      title: 'SEO',
      name: 'seo',
      type: 'seo'
    }
  ],
  preview: {
    select: {
      variantTitle: 'variantTitle',
      title: 'title',
      productID: 'productID',
      media: 'hero'
    },
    prepare({ variantTitle, title, productID = '(missing ID)', media }) {
      return {
        title: title ? title : variantTitle,
        media,
        subtitle: productID
      }
    }
  }
}
