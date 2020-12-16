import '../../branding/skin.css?raw'

export default {
  title: 'Portable Text',
  name: 'simplePortableText',
  type: 'array',
  of: [
    {
      title: 'Block',
      type: 'block',
      // Styles let you set what your user can mark up blocks with. These
      // corrensponds with HTML tags, but you can set any title or value
      // you want and decide how you want to deal with it where you want to
      // use your content.
      styles: [{ title: 'Normal', value: 'normal' }],
      lists: [],
      // Marks let you mark up inline text in the block editor.
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting by editors.
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' }
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            title: 'Link',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'Page Link',
                name: 'page',
                type: 'reference',
                to: [
                  { type: 'homePage' },
                  { type: 'samplePage' },
                  { type: 'shopPage' },
                  { type: 'page' },
                  { type: 'collection' },
                  { type: 'product' }
                ]
              },
              {
                title: 'External URL',
                name: 'href',
                type: 'url'
              }
            ]
          }
        ]
      }
    }
  ]
}
