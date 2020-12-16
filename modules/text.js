import React from 'react'
import BlockContent from '@sanity/block-content-to-react'
import { serializers } from './'

const Text = ({ data }) => {
  const { content } = data

  return (
    <section className="section">
      <div className="section--wrapper">
        <div className="section--content">
          <BlockContent
            renderContainerOnSingleChild
            className="rc"
            blocks={content}
            serializers={serializers}
          />
        </div>
      </div>
    </section>
  )
}

export default Text
