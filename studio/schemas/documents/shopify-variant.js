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
    },
    {
      title: 'Listing Settings',
      name: 'listing',
      options: { columns: 2 }
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
      name: 'comparePrice',
      title: 'Compare Price (cents)',
      type: 'number',
      readOnly: true,
      fieldset: 'shopify'
    },
    {
      name: 'inStock',
      title: 'In Stock?',
      type: 'boolean',
      readOnly: true,
      fieldset: 'shopify'
    },
    {
      name: 'lowStock',
      title: 'Low Stock?',
      type: 'boolean',
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
      title: 'Options',
      name: 'options',
      type: 'array',
      of: [{ type: 'productOptionValue' }],
      readOnly: true,
      fieldset: 'shopify'
    },
    {
      title: 'Draft Mode',
      name: 'isDraft',
      type: 'boolean',
      readOnly: true,
      hidden: true,
      fieldset: 'shopify'
    },
    {
      name: 'wasDeleted',
      title: 'Deleted from Shopify?',
      type: 'boolean',
      readOnly: true,
      hidden: true,
      fieldset: 'shopify'
    },
    {
      title: 'Display Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'SEO / Share Settings',
      name: 'seo',
      type: 'seo'
    }
  ],
  preview: {
    select: {
      isDraft: 'isDraft',
      wasDeleted: 'wasDeleted',
      title: 'title',
      variantTitle: 'variantTitle',
      productTitle: 'productTitle'
    },
    prepare({
      isDraft = false,
      wasDeleted = false,
      title,
      variantTitle,
      productTitle = '(missing product)'
    }) {
      const getSubtitle = () => {
        if (title) {
          return title === variantTitle ? null : `(${variantTitle})`
        } else {
          return productTitle
        }
      }

      return {
        title:
          (title ? title : variantTitle) +
          (wasDeleted ? ' (removed)' : '') +
          (isDraft ? ' (draft)' : ''),
        subtitle: getSubtitle()
      }
    }
  }
}
