import React from 'react'
import BlockContent from '@sanity/block-content-to-react'
import { serializers } from '@lib/serializers'

import Accordion from '@components/accordion'

const Accordions = ({ data }) => {
  const { items } = data
  return (
    <div className="accordion-group">
      {items.map((accordion, key) => {
        return (
          <Accordion
            key={key}
            title={accordion.title}
            id={accordion.id}
            index={key}
          >
            <BlockContent
              renderContainerOnSingleChild
              className="rc"
              blocks={accordion.content}
              serializers={serializers}
            />
          </Accordion>
        )
      })}
    </div>
  )
}

export default Accordions
