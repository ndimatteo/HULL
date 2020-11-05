import { FiCheckCircle } from 'react-icons/fi'

export default {
  title: 'Option',
  name: 'productOptionValue',
  type: 'object',
  icon: FiCheckCircle,
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string'
    },
    {
      title: 'Value',
      name: 'value',
      type: 'string'
    },
    {
      title: 'Position',
      name: 'position',
      type: 'number'
    }
  ]
}
