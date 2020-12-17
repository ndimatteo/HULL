import React from 'react'

import { getStaticPage } from '../../lib/api'

import Layout from '../../components/layout'
import Collection from '../../components/shop/collection'

const Shop = ({ data, preview }) => {
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
        <div className="section--wrapper">
          <h1 className="text-center">{page.title}</h1>
          <Collection paginationLimit={12} preview={preview} />
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps({ preview, previewData }) {
  const shopData = await getStaticPage(
    `
    *[_type == "shopPage"] | order(_updatedAt desc)[0]{
      title,
      seo
    }
  `,
    {
      active: preview,
      token: previewData?.token,
    }
  )

  return {
    props: {
      data: shopData,
      preview: {
        active: preview ? true : false,
        token: previewData?.token || null,
      },
    },
  }
}

export default Shop
