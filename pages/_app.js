import React, { useEffect } from 'react'
import Router from 'next/router'
import App from 'next/app'
import { AnimatePresence } from 'framer-motion'
import '../styles/app.css'

// import TagManager from 'react-gtm-module'

// const tagManagerArgs = {
//   gtmId: 'GTM-XXXXXXX',
// }

Router.events.on('routeChangeStart', () => {
  if (typeof document !== `undefined`) {
    document.documentElement.classList.add('is-loading')
  }
})

Router.events.on('routeChangeComplete', () => {
  if (typeof document !== `undefined`) {
    document.documentElement.classList.remove('is-loading')
  }
})

Router.events.on('routeChangeError', () => {
  if (typeof document !== `undefined`) {
    document.documentElement.classList.remove('is-loading')
  }
})

const MyApp = ({ Component, pageProps, router }) => {
  // useEffect(() => {
  //   TagManager.initialize(tagManagerArgs)
  // }, [])

  useEffect(() => {
    window.history.scrollRestoration = 'manual'
  }, [router])

  return (
    <AnimatePresence
      exitBeforeEnter
      onExitComplete={() => {
        window.scrollTo(0, 0)
        document.body.classList.remove('nav-open')
      }}
    >
      <Component {...pageProps} key={router.asPath} />
    </AnimatePresence>
  )
}

export default MyApp
