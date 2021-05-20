import React from 'react'
import cx from 'classnames'
import BlockContent from '@sanity/block-content-to-react'
import { serializers } from '@/lib/serializers'
import type { Freeform as FreeformType } from '@/lib/shared-types'

type FreeFormProps = {
  data: FreeformType
}

const Freeform = ({ data }: FreeFormProps) => {
  const { maxWidth, textAlign, content } = data

  if (!content) return null

  return (
    <BlockContent
      renderContainerOnSingleChild
      className={cx('rc', maxWidth, textAlign)}
      blocks={content}
      serializers={serializers}
    />
  )
}

export default Freeform
