import { serializers } from '@/lib/serializers'
import React from 'react'
import BlockContent from '@sanity/block-content-to-react'
import Accordion from '@/components/accordion'
import type API from '@/lib/shared-types'

type AccordionProps = {
  data: API['Accordions']
}

const Accordions = ({ data }: AccordionProps) => {
  const { items } = data
  return (
    <div className="accordion-group">
      {items?.map((accordion, key: number) => {
        return (
          <Accordion key={key} title={accordion.title ?? ''} id={accordion.id}>
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
