import { FiCheckCircle } from 'react-icons/fi'

export default {
  title: 'Option',
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
      title: 'Values',
      name: 'values',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      title: 'Position',
      name: 'position',
      type: 'number'
    }
  ]
}
