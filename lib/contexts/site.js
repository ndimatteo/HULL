import React, { useContext } from 'react'

import { SiteContext } from '.'

// Set initial store states
const siteContext = {
  meganav: {
    isOpen: false,
    activeID: null,
  },
}

// Toggle Mega Navigation states
function useToggleMegaNav() {
  const {
    context: { meganav },
    setContext,
  } = useContext(SiteContext)

  async function toggleMegaNav(state, id = null) {
    setContext((prevState) => {
      return {
        ...prevState,
        meganav: {
          isOpen: state === 'toggle' ? !meganav.isOpen : state,
          activeID: state === 'toggle' && meganav.isOpen ? null : id,
        },
      }
    })
  }
  return toggleMegaNav
}

// Know if you're hovering over a link or not hover context
function useLinkHover() {
  const { setContext } = useContext(SiteContext)

  async function toggleHover(state) {
    setContext((prevState) => {
      return {
        ...prevState,
        isHovering: state,
      }
    })
  }
  return toggleHover
}

export { siteContext, useToggleMegaNav, useLinkHover }
