import React from 'react'

import { getStaticPage, modules } from '../../lib/api'

import Layout from '../../components/layout'
import Collection from '../../components/shop/collection'

const Shop = ({ data, preview }) => {
  const { site, page } = data

  return (
    <Layout site={site} page={page}>
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
      hasTransparentHeader,
      modules[]{
        ${modules}
      },
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
