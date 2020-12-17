export const assemblePageUrl = ({ document, options }) => {
  const { slug } = document
  const { previewURL } = options
  if (!previewURL) {
    console.warn('Missing preview URL', { slug, previewURL })
    return ''
  }

  return previewURL + (slug ? `/${slug.current}` : '')
}

const defaults = { nonTextBehavior: 'remove' }

export function toPlainText(blocks, opts = {}) {
  const options = Object.assign({}, defaults, opts)
  return blocks
    .map(block => {
      if (block._type !== 'block' || !block.children) {
        return options.nonTextBehavior === 'remove'
          ? ''
          : `[${block._type} block]`
      }

      return block.children.map(child => child.text).join('')
    })
    .join('\n\n')
}
