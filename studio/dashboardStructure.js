export default {
  widgets: [
    {
      name: 'last-edited',
      options: {
        title: 'Recently edited',
        order: '_updatedAt desc',
        limit: 10,
        types: ['page', 'product', 'collection']
      },
      layout: { width: 'medium' }
    },
    // {
    //   name: 'project-users',
    //   layout: {
    //     width: 'small'
    //   }
    // },
    {
      name: 'project-details',
      layout: {
        width: 'medium'
      }
    }
  ]
}
