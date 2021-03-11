export default {
  widgets: [
    { name: 'structure-menu', layout: { width: 'full' } },
    {
      name: 'document-list',
      options: {
        title: 'Recently edited',
        order: '_updatedAt desc',
        limit: 10,
        types: ['homePage', 'page'],
      },
      layout: { width: 'medium' },
    },
    {
      name: 'project-users',
    },
    {
      name: 'project-info',
    },
  ],
}
