import React, { useState } from 'react'

import Accordion from '@components/accordion'
import BlockContent from '@components/block-content'

const AccordionList = ({ data }) => {
  const { items } = data

  const [activeAccordion, setActiveAccordion] = useState(null)

  const onToggle = (id, status) => {
    setActiveAccordion(status ? id : null)
  }

  return (
    <div className="accordion-group">
      {items.map((accordion, key) => {
        return (
          <Accordion
            key={key}
            id={accordion.id}
            isOpen={accordion.id === activeAccordion}
            onToggle={onToggle}
            title={accordion.title}
          >
            <BlockContent blocks={accordion.content} />
          </Accordion>
        )
      })}
    </div>
  )
}

export default AccordionList
