import React from 'react'
import BlockContent from '@sanity/block-content-to-react'
import { serializers } from '../../modules'

const ProductDescription = ({ content }) => {
  return (
    <div className="product--desc">
      <BlockContent
        renderContainerOnSingleChild
        className="rc"
        blocks={content}
        serializers={serializers}
      />
    </div>
  )
}

export default ProductDescription
