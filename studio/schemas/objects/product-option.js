import { CheckCircle } from 'phosphor-react'

export default {
  title: 'Product Option',
  name: 'productOption',
  type: 'object',
  icon: CheckCircle,
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string'
    },
    {
      title: 'Position',
      name: 'position',
      type: 'number'
    },
    {
      title: 'Values',
      name: 'values',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    }
  ]
}
