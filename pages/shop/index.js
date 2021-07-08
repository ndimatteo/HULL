import React from 'react'

import { getStaticPage, queries } from '@data'

import Layout from '@components/layout'
import { Module } from '@components/modules'

const Shop = ({ data }) => {
  const { site, page } = data

  return (
    <Layout site={site} page={page}>
      {page.modules?.map((module, key) => (
        <Module
          key={key}
          module={module}
          collectionProducts={page.products}
          featuredProducts={page.featuredProducts}
        />
      ))}
    </Layout>
  )
}

export async function getStaticProps({ preview, previewData }) {
  const shopData = await getStaticPage(
    `
    *[_type == "shopPage"] | order(_updatedAt desc)[0]{
      hasTransparentHeader,
      modules[]{
        ${queries.modules}
      },
      "products": ${queries.allProducts(preview)},
      "featuredProducts": featuredProducts[]->productID,
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
    },
  }
}

export default Shop
