import { CheckCircle } from 'phosphor-react'

export default {
  title: 'Option',
  name: 'productOptionValue',
  type: 'object',
  icon: CheckCircle,
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
