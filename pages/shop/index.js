import React from 'react'

import { getStaticPage } from '../../lib/api'

import Layout from '../../components/layout'
import Collection from '../../components/shop/collection'

const Shop = ({ data }) => {
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
        <Collection paginationLimit={12} />
      </section>
    </Layout>
  )
}

export async function getStaticProps(context) {
  const shopData = await getStaticPage(`
    *[_type == "shopPage"][0]{
      title,
      seo
    }
  `)

  return {
    props: {
      data: shopData,
    },
  }
}

export default Shop
