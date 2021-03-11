export default {
  title: 'Header Settings',
  name: 'headerSettings',
  type: 'document',
  __experimental_actions: ['update', 'publish'], // disable for initial publish
  fieldsets: [
    {
      title: 'Desktop',
      name: 'desktop',
      description: 'Navigation settings for desktop view',
      options: { collapsible: true }
    },
    {
      title: 'Mobile',
      name: 'mobile',
      description: 'Navigation settings for mobile view',
      options: { collapsible: true }
    }
  ],
  fields: [
    {
      title: 'Menu (Left)',
      name: 'menuLeft',
      type: 'reference',
      to: [{ type: 'menu' }],
      fieldset: 'desktop'
    },
    {
      title: 'Menu (Right)',
      name: 'menuRight',
      type: 'reference',
      to: [{ type: 'menu' }],
      fieldset: 'desktop'
    },
    {
      title: 'Menu',
      name: 'menuMobile',
      type: 'reference',
      to: [{ type: 'menu' }],
      fieldset: 'mobile'
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Header Settings'
      }
    }
  }
}
