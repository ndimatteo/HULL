const crops = [
  { title: 'Original', value: 0 },
  { title: '1 : 1 (square)', value: 1 },
  { title: '5 : 7', value: 0.7142857143 },
  { title: '4 : 6', value: 0.6666666667 },
  { title: '16 : 9', value: 1.7777777778 }
]

export default {
  title: 'Image',
  name: 'figure',
  type: 'image',
  options: {
    hotspot: true
  },
  fields: [
    {
      title: 'Display Size (aspect ratio)',
      name: 'customRatio',
      type: 'number',
      options: {
        isHighlighted: true,
        list: crops
      },
      validation: Rule => {
        return Rule.custom((field, context) =>
          'asset' in context.parent && field === undefined ? 'Required!' : true
        )
      }
    },
    {
      title: 'Alternative text',
      name: 'alt',
      type: 'string',
      description: 'Important for SEO and accessiblity.',
      options: {
        isHighlighted: true
      },
      validation: Rule => {
        return Rule.custom((field, context) =>
          'asset' in context.parent && field === undefined
            ? 'Required! (think about non-visual readers)'
            : true
        )
      }
    }
  ],
  preview: {
    select: {
      asset: 'asset',
      alt: 'alt',
      customRatio: 'customRatio'
    },
    prepare({ alt, customRatio, asset }) {
      const crop = crops.find(crop => crop.value === customRatio)

      return {
        title: alt || '(alt text missing)',
        subtitle: crop.title,
        media: asset
      }
    }
  }
}
