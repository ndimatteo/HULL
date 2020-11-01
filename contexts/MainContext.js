import React, { useState, createContext, useEffect } from 'react'
import { isBrowser } from '../lib/helpers'

export const Context = createContext()

const initialStoreState = {
  isCartOpen: false,
  isMobile: null,
}

const ContextProvider = ({ children }) => {
  const [store, updateStore] = useState(initialStoreState)

  function handler() {
    if (
      window.innerWidth <= 768 &&
      (store.isMobile === false || store.isMobile === null)
    ) {
      updateStore((prevState) => {
        return {
          ...prevState,
          isMobile: true,
        }
      })
    }
    if (
      window.innerWidth > 768 &&
      (store.isMobile === true || store.isMobile === null)
    ) {
      updateStore((prevState) => {
        return {
          ...prevState,
          isMobile: false,
        }
      })
    }
  }

  useEffect(() => {
    if (isBrowser) {
      window.addEventListener('resize', handler)
    }
    return () => {
      if (isBrowser) window.removeEventListener('resize', handler)
    }
  })

  useEffect(() => {
    if (isBrowser && store.isMobile === null) {
      handler()
    }
  }, []) //eslint-disable-line

  return (
    <Context.Provider
      value={{
        store,
        setIsCartOpen: (bool) => {
          updateStore((prevState) => {
            return {
              ...prevState,
              isCartOpen: bool,
            }
          })
        },
      }}
    >
      {children}
    </Context.Provider>
  )
}
export default ContextProvider
