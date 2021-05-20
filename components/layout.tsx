import React, { useEffect } from 'react'
import Head from 'next/head'
import { m } from 'framer-motion'
import { imageBuilder } from '@/lib/sanity'
import { isBrowser, useWindowSize } from '@/lib/helpers'
import generateSchema from '@/lib/schema'
import CookieBar from '@/modules/shared/cookie-bar'
import Header from '@/modules/shared/header'
import Footer from '@/modules/shared/footer'
import type { SeoSettings } from '@/lib/shared-types'
import type API from '@/lib/shared-types'

const duration = 0.4
const variants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: duration,
      delay: 0.3,
      ease: 'linear',
      when: 'beforeChildren',
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: duration, ease: 'linear', when: 'beforeChildren' },
  },
}

interface LayoutProps {
  site?: API['SiteData']
  page?: {
    seo?: SeoSettings
    hasTransparentHeader?: boolean
  }
  schema?: {}
  children: React.ReactNode
}

const Layout = ({ site, page, schema, children }: LayoutProps) => {
  // set <head> variables
  const siteTitle = site?.seo?.siteTitle
  const siteIcon = site?.seo?.siteIcon

  const metaTitle = page?.seo?.metaTitle || site?.seo?.metaTitle
  const metaDesc = page?.seo?.metaDesc || site?.seo?.metaDesc

  const shareTitle = page?.seo?.shareTitle || site?.seo?.shareTitle
  const shareDesc = page?.seo?.shareDesc || site?.seo?.shareDesc
  const shareGraphic =
    page?.seo?.shareGraphic?.asset || site?.seo?.shareGraphic?.asset

  // set window height var
  const { height: windowHeight } = useWindowSize()

  useEffect(() => {
    if (isBrowser) {
      document.body.style.setProperty('--vh', `${windowHeight * 0.01}px`)
    }
  }, [windowHeight])

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="format-detection" content="telephone=no" />

        {/* TODO: preload? */}
        <link rel="icon" href="/favicon.svg" />
        <link rel="mask-icon" href="/favicon.svg" color="#000000" />
        {siteIcon && (
          <link
            rel="apple-touch-icon"
            href={
              imageBuilder.image(siteIcon).width(180).height(180).url() ??
              undefined
            }
          />
        )}

        <link rel="preconnect" href="https://hull-demo.myshopify.com" />
        {/* TODO: crossOrigin? */}
        <link rel="preconnect" href="https://cdn.sanity.io" />

        <title>{metaTitle}</title>
        {metaDesc && <meta name="description" content={metaDesc} />}

        {shareTitle && (
          <>
            <meta property="og:title" content={shareTitle} />
            <meta name="twitter:title" content={shareTitle} />
          </>
        )}

        {shareDesc && (
          <>
            <meta property="og:description" content={shareDesc} />
            <meta name="twitter:description" content={shareDesc} />
          </>
        )}

        {shareGraphic && (
          <>
            <meta
              property="og:image"
              content={
                imageBuilder
                  .image(shareGraphic)
                  .width(1200)
                  .height(630)
                  .url() ?? undefined
              }
            />
            <meta
              name="twitter:image"
              content={
                imageBuilder
                  .image(shareGraphic)
                  .width(1200)
                  .height(630)
                  .url() ?? undefined
              }
            />
          </>
        )}

        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />

        {siteTitle && <meta name="og:site_name" content={siteTitle} />}

        {schema && generateSchema(schema)}
      </Head>

      {/* @ts-ignore -TODO: update this type  */}
      <CookieBar data={site?.cookieConsent} />

      <m.div initial="initial" animate="enter" exit="exit" variants={variants}>
        {site?.header && (
          <Header
            data={site?.header}
            isTransparent={!!page?.hasTransparentHeader}
          />
        )}
        <main id="content">{children}</main>
        {site?.footer && <Footer data={site?.footer} />}
      </m.div>
    </>
  )
}

export default Layout
