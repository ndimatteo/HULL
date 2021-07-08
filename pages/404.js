import React from 'react'

import { getStaticPage, queries } from '@data'

import Layout from '@components/layout'
import { Module } from '@components/modules'

const ErrorPage = ({ data }) => {
  const { site, menus, page } = data

  return (
    <Layout
      site={site}
      menus={menus}
      page={{
        seo: page.seo,
      }}
    >
      {page.modules?.map((module, key) => (
        <Module key={key} module={module} />
      ))}
    </Layout>
  )
}

export async function getStaticProps({ preview, previewData }) {
  const pageData = await getStaticPage(
    `
    *[_type == "page" && _id == ${queries.errorID}] | order(_updatedAt desc)[0]{
      modules[]{
        ${queries.modules}
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

export default ErrorPage
