import { LinkSimpleHorizontal } from 'phosphor-react'

import { getStaticRoute, getDynamicRoute } from '../../lib/helpers'

export default {
  title: 'Page',
  name: 'navPage',
  type: 'object',
  icon: LinkSimpleHorizontal,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'Display Text'
    },
    {
      title: 'Page',
      name: 'page',
      type: 'reference',
      to: [{ type: 'page' }, { type: 'collection' }, { type: 'product' }]
    }
  ],
  preview: {
    select: {
      title: 'title',
      pageType: 'page._type',
      pageSlug: 'page.slug.current'
    },
    prepare({ title, pageType, pageSlug }) {
      const isStatic = getStaticRoute(pageType)
      const isDynamic = getDynamicRoute(pageType)

      return {
        title: title,
        subtitle:
          isStatic !== false
            ? `/${isStatic}`
            : `/${isDynamic ? `${isDynamic}/` : ''}${pageSlug}`
      }
    }
  }
}
