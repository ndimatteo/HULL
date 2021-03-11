import { FiCheckCircle } from 'react-icons/fi'

export default {
  title: 'Product Option',
  name: 'productOption',
  type: 'object',
  icon: FiCheckCircle,
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
