import React from 'react'

import Layout from '../components/layout'
import { getStaticPage, modules } from '../lib/api'

import { Module } from '../modules'

const Home = ({ data }) => {
  const { site, menus, page } = data

  return (
    <Layout
      site={{
        seo: site.seo,
        social: site.social,
      }}
      page={{
        seo: page.seo,
      }}
    >
      <div className="flex flex-col items-center justify-center min-h-screen">
        {page.content?.map((module, key) => (
          <Module key={key} module={module} />
        ))}
      </div>
    </Layout>
  )
}

export async function getStaticProps({ preview, previewData }) {
  const pageData = await getStaticPage(
    `
    *[_type == "homePage"] | order(_updatedAt desc)[0]{
      content[]{
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
