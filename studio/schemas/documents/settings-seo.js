import React from 'react'
import { decodeAssetUrl } from '../../lib/helpers'

export default {
  title: 'Default SEO / Share',
  name: 'seoSettings',
  type: 'document',
  groups: [
    { title: 'Global SEO', name: 'seo', default: true },
    { title: 'Social Sharing', name: 'social' },
    { title: 'Browser Icons', name: 'icons' }
  ],
  fields: [
    {
      name: 'seoNote',
      type: 'note',
      options: {
        headline: 'Template Tags',
        message: (
          <>
            <span>
              You can use <code>{`{{ page_title }}`}</code> and{' '}
              <code>{`{{ site_title }}`}</code> to dynamically display the page
              title and global site title in the "Meta Title" and "Share Title"
              fields.
            </span>
          </>
        ),
        tone: 'primary'
      },
      group: ['seo', 'social']
    },
    {
      title: 'Default Meta Title',
      name: 'metaTitle',
      type: 'string',
      description: 'Title used for search engines and browsers',
      validation: Rule =>
        Rule.max(50).warning(
          'Longer titles may be truncated by search engines'
        ),
      group: 'seo'
    },
    {
      title: 'Default Meta Description',
      name: 'metaDesc',
      type: 'text',
      rows: 3,
      description: 'Description for search engines',
      validation: Rule =>
        Rule.max(150).warning(
          'Longer descriptions may be truncated by search engines'
        ),
      group: 'seo'
    },
    {
      title: 'Default Share Title',
      name: 'shareTitle',
      type: 'string',
      description: 'Title used for social sharing cards',
      validation: Rule =>
        Rule.max(50).warning('Longer titles may be truncated by social sites'),
      group: 'social'
    },
    {
      title: 'Default Share Description',
      name: 'shareDesc',
      type: 'text',
      rows: 3,
      description: 'Description used for social sharing cards',
      validation: Rule =>
        Rule.max(150).warning(
          'Longer descriptions may be truncated by social sites'
        ),
      group: 'social'
    },
    {
      title: 'Default Share Graphic',
      name: 'shareGraphic',
      type: 'image',
      description: 'Recommended size: 1200x630 (PNG or JPG)',
      group: 'social'
    },
    {
      title: 'Browser Icon (Favicon)',
      name: 'favicon',
      type: 'image',
      description: 'Upload a 16 x 16 SVG icon to use as the browser icon',
      options: {
        accept: 'image/svg+xml'
      },
      validation: Rule => {
        return Rule.custom(field => {
          if (!field) return true

          const { dimensions } = decodeAssetUrl(field.asset._ref)

          if (dimensions.width !== 16 || dimensions.height !== 16) {
            return 'Favicon must be a 16x16 SVG'
          } else {
            return true
          }
        })
      },
      group: 'icons'
    },
    {
      title: 'Legacy Browser Icon (.ico)',
      name: 'faviconLegacy',
      type: 'file',
      description: 'Upload a 32 x 32 .ico file for older browsers',
      validation: Rule => {
        return Rule.custom(field => {
          if (!field) return true

          const { format } = decodeAssetUrl(field.asset._ref)

          if (format !== 'ico') {
            return 'Legacy Favicon must be a 32x32 ICO file'
          } else {
            return true
          }
        })
      },
      group: 'icons'
    },
    {
      title: 'Touch Icon',
      name: 'touchIcon',
      type: 'image',
      description: 'Recommended size: 192x192 (PNG)',
      group: 'icons'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Default SEO / Share'
      }
    }
  }
}
