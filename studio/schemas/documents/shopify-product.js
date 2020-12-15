import { FiGift } from 'react-icons/fi'

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
      title: '',
      name: '2up',
      options: { columns: 2 }
    }
  ],
  icon: FiGift,
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
      title: 'Draft Mode',
      name: 'isDraft',
      type: 'boolean',
      readOnly: true,
      hidden: true,
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
      title: 'Gallery',
      name: 'galleryPhotos',
      type: 'array',
      of: [{ type: 'productGalleryPhotos' }],
      description:
        'Define a Gallery for your product, or for a subset of variants'
    },
    {
      title: 'Use Galleries',
      name: 'useGallery',
      type: 'string',
      description: 'Use galleries over listing thumbnails on Collection pages',
      options: {
        list: [
          { title: 'Yes', value: 'true' },
          { title: 'No', value: 'false' }
        ]
      },
      fieldset: '2up'
    },
    {
      title: 'Surface Option',
      name: 'surfaceOption',
      type: 'string',
      description:
        'Surface one of the product options for this product on Collection pages',
      options: {
        list: [{ title: 'None', value: '' }],
        fromField: 'options',
        fromFieldData: { title: 'name', value: 'position' }
      },
      fieldset: '2up'
    },
    {
      title: 'Listing Thumbnails',
      name: 'listingPhotos',
      type: 'array',
      of: [{ type: 'productListingPhotos' }],
      fieldset: '2up'
    },
    {
      title: 'Cart Thumbnails',
      name: 'cartPhotos',
      type: 'array',
      of: [{ type: 'productCartPhotos' }],
      fieldset: '2up'
    },
    {
      title: 'SEO / Share Settings',
      name: 'seo',
      type: 'seo'
    }
  ],
  initialValue: {
    useGallery: 'false',
    galleryPhotos: {
      _type: 'productGallery',
      forOption: ''
    },
    listingPhotos: {
      _type: 'productListingPhotos',
      forOption: ''
    },
    cartPhotos: {
      _type: 'productCartPhotos',
      forOption: ''
    }
  },
  preview: {
    select: {
      isDraft: 'isDraft',
      wasDeleted: 'wasDeleted',
      title: 'title',
      productTitle: 'productTitle',
      slug: 'slug',
      cartPhotos: 'cartPhotos',
      listingPhoto: 'listingPhoto'
    },
    prepare({
      isDraft = false,
      wasDeleted = false,
      title,
      productTitle,
      slug = {},
      cartPhotos
    }) {
      const path = `/products/${slug.current}`
      return {
        title:
          (title ? title : productTitle) +
          (wasDeleted ? ' (removed)' : '') +
          (isDraft ? ' (draft)' : ''),
        media: cartPhotos?.length > 0 ? cartPhotos[0].cartPhoto : null,
        subtitle: slug.current ? path : '(missing slug)'
      }
    }
  }
}
