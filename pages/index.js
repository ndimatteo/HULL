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
        menus: menus,
      }}
      page={{
        seo: page.seo,
      }}
    >
      {page.content?.map((module, key) => (
        <Module key={key} module={module} />
      ))}
    </Layout>
  )
}

export async function getStaticProps() {
  const pageData = await getStaticPage(`
    *[_type == "homePage"][0]{
      content[]{
        ${modules}
      },
      seo
    }
  `)

  return {
    props: {
      data: pageData,
    },
  }
}

export default Home
