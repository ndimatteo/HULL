import React from 'react'
import BlockContent from '@sanity/block-content-to-react'

import Photo from '../components/photo'
import CustomLink from '../components/link'

export const serializers = {
  types: {
    block: (props) => {
      const { style = 'normal' } = props.node

      if (style === 'mockH1') {
        return <p className="is-h1">{props.children}</p>
      }

      return BlockContent.defaultSerializers.types.block(props)
    },
    figure: ({ node }) => {
      return <Photo photo={node} />
    },
    horizontalRule: () => <hr />,
  },
  marks: {
    link: ({ mark, children }) => {
      return <CustomLink link={{ ...mark, ...{ title: children[0] } }} />
    },
  },
}
