import { Funnel } from 'phosphor-react'

export default {
  title: 'Filter',
  name: 'shopFilter',
  type: 'object',
  description: 'Display a filter drawer on shop collection pages',
  options: {
    collapsible: true
  },
  fields: [
    {
      title: 'Enable Filtering?',
      name: 'isActive',
      type: 'boolean',
      initialValue: false
    },
    {
      title: 'Filter Groups',
      name: 'groups',
      type: 'array',
      of: [
        {
          title: 'Group',
          name: 'group',
          type: 'object',
          icon: Funnel,
          fields: [
            {
              title: 'Display',
              name: 'display',
              type: 'string',
              options: {
                list: [
                  { title: 'Default', value: ' ' },
                  { title: 'Button Grid', value: 'grid' }
                ]
              },
              initialValue: ' '
            },
            {
              title: 'Title',
              name: 'title',
              type: 'string'
            },
            {
              title: 'Slug',
              name: 'slug',
              type: 'slug',
              description: 'required',
              options: {
                source: (_, context) => context.parent.title,
                isUnique: (slug, context) => {
                  const otherGroupSlugs = context.document.filter.groups
                    .filter(g => g._key !== context.parent._key)
                    .map(g => g.slug.current)

                  return ![...otherGroupSlugs, 'sort'].includes(slug)
                },
                maxLength: 15
              }
            },
            {
              title: 'Associated Filters',
              name: 'options',
              type: 'array',
              of: [
                {
                  title: 'Filter',
                  type: 'reference',
                  to: [{ type: 'filter' }],
                  options: {
                    filter: ({ document }) => {
                      const addedFilters = document.filter.groups.flatMap(g =>
                        g.options.map(p => p._ref).filter(Boolean)
                      )

                      return {
                        filter: '!(_id in $ids)',
                        params: {
                          ids: addedFilters
                        }
                      }
                    }
                  }
                }
              ],
              validation: Rule => Rule.unique()
            }
          ],
          preview: {
            select: {
              title: 'title'
            },
            prepare({ title }) {
              return {
                title: title
              }
            }
          }
        }
      ]
    }
  ]
}
