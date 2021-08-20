import { FiFilter } from 'react-icons/fi'

export default {
  title: 'Filter',
  name: 'shopFilter',
  type: 'object',
  description: 'Display a filter drawer on shop collection pages.',
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
          fields: [
            {
              title: 'Title',
              name: 'title',
              type: 'string'
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
                      console.log(document)
                      const addedFilters = document.filter.groups.map(g =>
                        g.options.map(p => p._ref).filter(Boolean)
                      )

                      console.log(addedFilters)

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
                title: title,
                media: FiFilter
              }
            }
          }
        }
      ]
    }
  ]
}
