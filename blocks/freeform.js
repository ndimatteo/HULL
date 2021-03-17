import React from 'react'
import cx from 'classnames'
import BlockContent from '@sanity/block-content-to-react'
import { serializers } from '@lib/serializers'

const Freeform = ({ data }) => {
  const { blockAlign, textAlign, maxWidth, content } = data

  if (!content) return null

  return (
    <BlockContent
      renderContainerOnSingleChild
      className={cx('rc', textAlign, blockAlign, maxWidth)}
      blocks={content}
      serializers={serializers}
    />
  )
}

export default Freeform
