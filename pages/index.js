import React from 'react'

import Layout from '@components/layout'
import { getStaticPage, modules } from '@lib/api'

import { Module } from '@modules/index'

const Home = ({ data }) => {
  const { site, page } = data

  return (
    <Layout site={site} page={page}>
      {page.modules?.map((module, key) => (
        <Module key={key} module={module} />
      ))}
    </Layout>
  )
}

export async function getStaticProps({ preview, previewData }) {
  const pageData = await getStaticPage(
    `
    *[_type == "homePage"] | order(_updatedAt desc)[0]{
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
      data: pageData,
    },
  }
}

export default Home
