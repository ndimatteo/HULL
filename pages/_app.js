import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { AnimatePresence } from 'framer-motion'

import '../styles/tailwind.css'
import '../styles/app.css'

import { SiteContextProvider } from '../lib/contexts'
import PageTransition from '../components/page-transition'
import Cart from '../components/cart/index'

const MyApp = ({ Component, pageProps, router }) => {
  const [isLoading, setLoading] = useState(false)
  const [isLoaderReady, setLoaderReady] = useState(false)
  const [loadingDone, setLoadingDone] = useState(false)

  // The scroll location on the page is not restored on history changes
  useEffect(() => {
    window.history.scrollRestoration = 'manual'
  }, [router])

  // Reset our page-transition states
  useEffect(() => {
    if (loadingDone && isLoaderReady) {
      setLoading(false)
      setLoaderReady(false)
      setLoadingDone(false)
    }
  }, [loadingDone, isLoaderReady])

  // Setup Next router events
  useEffect(() => {
    Router.events.on('routeChangeStart', (url) => {
      // bail if we're just changing a URL parameter
      if (
        url.indexOf('?') > -1 &&
        url.split('?')[0] === router.asPath.split('?')[0]
      )
        return

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
    <SiteContextProvider>
      <Cart />
      <AnimatePresence
        exitBeforeEnter
        onExitComplete={() => {
          window.scrollTo(0, 0)
          document.body.classList.remove('overflow-hidden')
        }}
      >
        {isLoading ? (
          <PageTransition />
        ) : (
          <Component key={router.asPath.split('?')[0]} {...pageProps} />
        )}
      </AnimatePresence>
    </SiteContextProvider>
  )
}

export default MyApp
