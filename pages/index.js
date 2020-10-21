import React from 'react'
import Link from 'next/link'

import { getStaticPage } from '../lib/api'

import Layout from '../components/layout'
import Hero from '../modules/hero'

const Home = ({ data }) => {
  const { site, menus, page } = data

  return (
    <Layout
      site={{
        seo: site.seo,
        social: site.social,
        menus: menus,
      }}
      page={{
        seo: page.seo,
      }}
    >
      <section className="section">
        <h1>{page.title}</h1>
        <Link href="/666" scroll={false}>
          <a className="btn">Set the world on fire</a>
        </Link>
      </section>

      {page.hero && (
        <Hero
          data={{
            photo: page.hero,
            size: 'portrait',
          }}
        />
      )}
    </Layout>
  )
}

export async function getStaticProps(context) {
  const pageData = await getStaticPage('homePage')

  return {
    props: {
      data: pageData,
    },
  }
}

export default Home
