import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { AnimatePresence } from 'framer-motion'

import '../styles/tailwind.css'
import '../styles/app.css'

import { ShopifyContextProvider } from '../contexts/shopify-context'
import Cart from '../components/cart/index'

import PageTransition from '../components/page-transition'

// import TagManager from 'react-gtm-module'

// const tagManagerArgs = {
//   gtmId: 'GTM-XXXXXXX',
// }

const MyApp = ({ Component, pageProps, router }) => {
  const [isLoading, setLoading] = useState(false)
  const [isLoaderReady, setLoaderReady] = useState(false)
  const [loadingDone, setLoadingDone] = useState(false)

  // useEffect(() => {
  //   TagManager.initialize(tagManagerArgs)
  // }, [])

  useEffect(() => {
    window.history.scrollRestoration = 'manual'
  }, [router])

  useEffect(() => {
    if (loadingDone && isLoaderReady) {
      setLoading(false)
      setLoaderReady(false)
      setLoadingDone(false)
    }
  }, [loadingDone, isLoaderReady])

  useEffect(() => {
    Router.events.on('routeChangeStart', (url) => {
      // bail if we're just changing a URL parameter
      if (url.split('?')[0] === window.location.pathname) return

      setLoading(true)
      setTimeout(() => {
        setLoaderReady(true)
      }, 1200)
      if (typeof document !== `undefined`) {
        document.documentElement.classList.add('is-loading')
      }
    })

    Router.events.on('routeChangeComplete', () => {
      setLoadingDone(true)
      if (typeof document !== `undefined`) {
        document.documentElement.classList.remove('is-loading')
      }
    })

    Router.events.on('routeChangeError', () => {
      setLoadingDone(true)
      if (typeof document !== `undefined`) {
        document.documentElement.classList.remove('is-loading')
      }
    })
  }, [])

  // intelligently add focus states if keyboard is used
  const handleFirstTab = (event) => {
    if (event.keyCode === 9) {
      if (typeof document !== `undefined`) {
        document.body.classList.add('is-tabbing')
        window.removeEventListener('keydown', handleFirstTab)
      }
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleFirstTab)
    return () => {
      window.removeEventListener('keydown', handleFirstTab)
    }
  }, [])

  return (
    <ShopifyContextProvider>
      <Cart />
      <AnimatePresence
        exitBeforeEnter
        onExitComplete={() => {
          window.scrollTo(0, 0)
          document.body.classList.remove('nav-open')
        }}
      >
        {isLoading ? (
          <PageTransition />
        ) : (
          <Component key={router.asPath.split('?')[0]} {...pageProps} />
        )}
      </AnimatePresence>
    </ShopifyContextProvider>
  )
}

export default MyApp
