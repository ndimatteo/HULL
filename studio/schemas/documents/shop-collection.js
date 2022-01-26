import React from 'react'
import { SquaresFour } from 'phosphor-react'

export default {
  title: 'Collection',
  name: 'collection',
  type: 'document',
  icon: () => <SquaresFour />,
  groups: [
    { title: 'Content', name: 'content', default: true },
    { title: 'Settings', name: 'settings' }
  ],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
      group: 'settings'
    },
    {
      title: 'URL Slug',
      name: 'slug',
      type: 'slug',
      description: '(required)',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required(),
      group: 'settings'
    },
    {
      title: 'Overlay header with transparency?',
      name: 'hasTransparentHeader',
      type: 'boolean',
      description:
        'When activated the header will overlay the first content module with a transparent background and white text until scrolling is engaged.',
      initialValue: false,
      group: 'settings'
    },
    {
      title: 'Page Content',
      name: 'modules',
      type: 'array',
      of: [
        { type: 'collectionGrid' },
        { type: 'grid' },
        { type: 'hero' },
        { type: 'marquee' },
        { type: 'dividerPhoto' },
        {
          title: 'Reusable Section',
          type: 'reference',
          to: [{ type: 'section' }]
        }
      ],
      validation: Rule =>
        Rule.custom(blocks => {
          const collectionGrids =
            blocks?.filter(block => block._type === 'collectionGrid') || []

          const collectionGridItems = collectionGrids.map(
            (item, index) => [{ _key: item._key }] || [index]
          )

          return collectionGrids.length === 1
            ? true
            : {
                message:
                  'You must have one "Collection Grid" module on the page',
                paths: collectionGridItems
              }
        }),
      group: 'content'
    },
    {
      title: 'Products Grid',
      name: 'products',
      type: 'array',
      of: [
        {
          title: 'Product',
          type: 'reference',
          to: [{ type: 'product' }],
          options: {
            filter: ({ document }) => {
              const addedProducts = document.products
                .map(p => p._ref)
                .filter(Boolean)

              return {
                filter: '!(_id in $ids)',
                params: {
                  ids: addedProducts
                }
              }
            }
          }
        }
      ],
      validation: Rule => Rule.unique(),
      group: 'content'
    },
    {
      title: 'SEO / Share Settings',
      name: 'seo',
      type: 'seo',
      group: 'settings'
    }
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug'
    },
    prepare({ title = 'Untitled', slug = {} }) {
      const path = `/shop/${slug.current}`
      return {
        title,
        subtitle: slug.current ? path : '(missing slug)'
      }
    }
  }
}
