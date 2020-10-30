import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { AnimatePresence } from 'framer-motion'
import '../styles/app.css'
import PageTransition from '../components/page-transition'

import ShopifyProvider from '../contexts/ShopifyContext'

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
    Router.events.on('routeChangeStart', () => {
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

  return (
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
        <ShopifyProvider>
          <Component {...pageProps} key={router.asPath} />
        </ShopifyProvider>
      )}
    </AnimatePresence>
  )
}

export default MyApp
