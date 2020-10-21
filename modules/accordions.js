import React, { useState } from 'react'
import BlockContent from '@sanity/block-content-to-react'
import { serializers } from '.'

import Accordion from '../components/accordion'

const Accordions = ({ data }) => {
  const { title, items } = data

  const [allOpen, setAllOpen] = useState(false)
  const [opened, setOpened] = useState(
    items.map((i) => ({ id: i.id, open: false }))
  )

  const onChange = (id, status) => {
    const newOpened = opened.map((accordion) =>
      accordion.id === id ? { ...accordion, open: status } : accordion
    )

    setOpened(newOpened)

    if (newOpened.every((accordion) => accordion.open === true)) {
      setAllOpen(true)
    }

    if (newOpened.every((accordion) => accordion.open === false)) {
      setAllOpen(false)
    }
  }

  return (
    <section className="section">
      <div className="section--content">
        <div className="section--title has-action">
          {title}
          <button className="btn" onClick={() => setAllOpen(!allOpen)}>
            {allOpen ? 'Collapse' : 'Expand'} All
          </button>
        </div>
        <div className="accordions-list">
          {items.map((accordion, key) => {
            return (
              <Accordion
                key={key}
                title={accordion.title}
                id={accordion.id}
                toggle={allOpen}
                onChange={onChange}
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
      </div>
    </section>
  )
}

export default Accordions
