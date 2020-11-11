import React, { useContext } from 'react'
import Link from 'next/link'

import { getStaticPage } from '../lib/api'

import Layout from '../components/layout'
import Photo from '../components/photo'

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
        <div className="hero">
          <Photo
            photo={page.hero}
            srcsetSize={[500, 800, 1200, 1800]}
            sizes="100vw"
            aspect="portrait"
            width="1800"
          />
        </div>
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
