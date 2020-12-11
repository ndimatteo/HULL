export default {
  widgets: [
    { name: 'structure-menu' },
    { name: 'project-users', layout: { height: 'auto' } },
    {
      name: 'document-list',
      options: {
        title: 'Recently edited',
        order: '_updatedAt desc',
        limit: 10,
        types: []
      },
      layout: { width: 'medium' }
    }
  ]
}
