export default {
  title: 'Option',
  name: 'productOption',
  type: 'object',
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
