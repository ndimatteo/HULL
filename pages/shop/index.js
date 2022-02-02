import React from 'react'
import Error from 'next/error'

import { getStaticPage, queries } from '@data'

import Layout from '@components/layout'
import { Module } from '@components/modules'

const Shop = ({ data }) => {
  const { site, page } = data

  if (!page) {
    return (
      <Error
        title={`"Shop Page" is not set in Sanity, or the page data is missing`}
        statusCode="Data Error"
      />
    )
  }

  return (
    <Layout site={site} page={page}>
      {page.modules?.map((module, key) => (
        <Module
          key={key}
          index={key}
          module={module}
          collectionProducts={page.products}
        />
      ))}
    </Layout>
  )
}

export async function getStaticProps({ preview, previewData }) {
  const shopData = await getStaticPage(
    `
    *[_type == "collection" && _id == ${queries.shopID}] | order(_updatedAt desc)[0]{
      "id": _id,
      hasTransparentHeader,
      modules[]{
        defined(_ref) => { ...@->content[0] {
          ${queries.modules}
        }},
        !defined(_ref) => {
          ${queries.modules},
        }
      },
      products[wasDeleted != true && isDraft != true]->${queries.product},
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
    },
  }
}

export default Shop
