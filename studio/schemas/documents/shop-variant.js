import React from 'react'
import { Copy, CloudArrowDown, ArrowsClockwise } from 'phosphor-react'

export default {
  name: 'productVariant',
  title: 'Variant',
  type: 'document',
  __experimental_actions: ['update', 'publish', 'delete'],
  groups: [
    { title: 'Content', name: 'content', default: true },
    { title: 'Settings', name: 'settings' },
    { title: 'Shopify Data', name: 'shopify', icon: CloudArrowDown }
  ],
  fieldsets: [
    {
      title: '',
      name: '2up',
      options: { columns: 2 }
    }
  ],
  icon: () => <Copy />,
  fields: [
    {
      title: 'Display Title',
      name: 'title',
      type: 'string',
      description:
        'Shown where variant names appear (for example: Above the product title in the cart)',
      group: 'content'
    },
    {
      title: 'SEO / Share Settings',
      name: 'seo',
      type: 'seo',
      group: 'settings'
    },
    {
      name: 'shopifyNote',
      type: 'note',
      options: {
        icon: ArrowsClockwise,
        message:
          'This data is automatically pulled in from your connected Shopify account. To make changes to this data please edit the product on Shopify directly.'
      },
      group: 'shopify'
    },
    {
      name: 'productTitle',
      title: 'Product Title',
      type: 'string',
      readOnly: true,
      fieldset: '2up',
      group: 'shopify'
    },
    {
      name: 'variantTitle',
      title: 'Variant Title',
      type: 'string',
      readOnly: true,
      fieldset: '2up',
      group: 'shopify'
    },
    {
      name: 'productID',
      title: 'Product ID',
      type: 'number',
      readOnly: true,
      fieldset: '2up',
      group: 'shopify'
    },
    {
      name: 'variantID',
      title: 'Variant ID',
      type: 'number',
      readOnly: true,
      fieldset: '2up',
      group: 'shopify'
    },
    {
      name: 'price',
      title: 'Price (cents)',
      type: 'number',
      readOnly: true,
      fieldset: '2up',
      group: 'shopify'
    },
    {
      name: 'comparePrice',
      title: 'Compare Price (cents)',
      type: 'number',
      readOnly: true,
      fieldset: '2up',
      group: 'shopify'
    },
    {
      name: 'inStock',
      title: 'In Stock?',
      type: 'boolean',
      readOnly: true,
      fieldset: '2up',
      group: 'shopify'
    },
    {
      name: 'lowStock',
      title: 'Low Stock?',
      type: 'boolean',
      readOnly: true,
      fieldset: '2up',
      group: 'shopify'
    },
    {
      name: 'sku',
      title: 'SKU',
      type: 'string',
      readOnly: true,
      fieldset: '2up',
      group: 'shopify'
    },
    {
      title: 'Options',
      name: 'options',
      type: 'array',
      of: [{ type: 'productOptionValue' }],
      readOnly: true,
      group: 'shopify'
    },
    {
      title: 'Draft Mode',
      name: 'isDraft',
      type: 'boolean',
      readOnly: true,
      hidden: true,
      fieldset: '2up',
      group: 'shopify'
    },
    {
      name: 'wasDeleted',
      title: 'Deleted from Shopify?',
      type: 'boolean',
      readOnly: true,
      hidden: true,
      fieldset: '2up',
      group: 'shopify'
    }
  ],
  preview: {
    select: {
      store: 'store',
      isDraft: 'isDraft',
      wasDeleted: 'wasDeleted',
      title: 'title',
      variantTitle: 'variantTitle',
      productTitle: 'productTitle'
    },
    prepare({
      store,
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
          (title ? title : variantTitle ?? store.title) +
          (wasDeleted ? ' (removed)' : '') +
          (isDraft ? ' (draft)' : ''),
        subtitle: getSubtitle()
      }
    }
  }
}
