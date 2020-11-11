import DynamicSelect from '../../components/dynamic-select'
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
      description: 'Synced from Shopify',
      options: { columns: 2, collapsible: true }
    },
    {
      title: 'Listing Settings',
      name: 'listing',
      options: { columns: 2 }
    }
  ],
  icon: FiShoppingCart,
  fields: [
    {
      title: 'Product Title',
      name: 'productTitle',
      type: 'string',
      readOnly: true,
      fieldset: 'shopify'
    },
    {
      title: 'Product ID',
      name: 'productID',
      type: 'number',
      readOnly: true,
      fieldset: 'shopify'
    },
    {
      title: 'Price (cents)',
      name: 'price',
      type: 'number',
      readOnly: true,
      fieldset: 'shopify'
    },
    {
      title: 'Compare Price (cents)',
      name: 'comparePrice',
      type: 'number',
      readOnly: true,
      fieldset: 'shopify'
    },
    {
      title: 'In Stock',
      name: 'inStock',
      type: 'boolean',
      readOnly: true,
      fieldset: 'shopify'
    },
    {
      title: 'Stock is Low',
      name: 'lowStock',
      type: 'boolean',
      readOnly: true,
      fieldset: 'shopify'
    },
    {
      title: 'SKU',
      name: 'sku',
      type: 'string',
      readOnly: true,
      fieldset: 'shopify'
    },
    {
      title: 'URL Slug',
      name: 'slug',
      type: 'slug',
      readOnly: true,
      fieldset: 'shopify'
    },
    {
      title: 'Options',
      name: 'options',
      type: 'array',
      of: [{ type: 'productOption' }],
      readOnly: true,
      fieldset: 'shopify'
    },
    {
      title: 'Deleted from Shopify?',
      name: 'wasDeleted',
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
      title: 'Description',
      name: 'description',
      type: 'simplePortableText'
    },
    {
      title: 'Gallery Photo(s)',
      name: 'photos',
      type: 'array',
      of: [{ type: 'figure' }],
      options: {
        layout: 'grid'
      }
    },
    {
      title: 'Cart Thumbnail',
      name: 'cartPhoto',
      type: 'figure',
      description: 'The default photo used in the cart for all product variants'
    },
    {
      title: 'Use Gallery Photos',
      name: 'useGallery',
      type: 'string',
      description: 'Show gallery instead of static photo',
      options: {
        list: [
          { title: 'Yes', value: 'true' },
          { title: 'No', value: 'false' }
        ]
      },
      fieldset: 'listing'
    },
    {
      title: 'Quick Add Option',
      name: 'quickOption',
      type: 'string',
      description: 'Which option to surface for quick add',
      options: {
        fromField: 'options',
        fromFieldData: { title: 'name', value: 'position' }
      },
      fieldset: 'listing'
    },
    {
      title: 'Thumbnail',
      name: 'listingPhoto',
      type: 'figure',
      fieldset: 'listing'
    },
    {
      title: 'Thumbnail (hover)',
      name: 'listingPhotoHover',
      type: 'figure',
      fieldset: 'listing'
    },
    {
      title: 'SEO',
      name: 'seo',
      type: 'seo'
    }
  ],
  initialValue: {
    useGallery: 'false'
  },
  preview: {
    select: {
      wasDeleted: 'wasDeleted',
      title: 'title',
      productTitle: 'productTitle',
      slug: 'slug',
      media: 'hero'
    },
    prepare({ wasDeleted = false, title, productTitle, slug = {}, media }) {
      const path = `/${slug.current}`
      return {
        title:
          (title ? title : productTitle) + (wasDeleted ? ' (removed)' : ''),
        media,
        subtitle: slug.current ? path : '(missing slug)'
      }
    }
  }
}
