import React from 'react'
import { useRouter } from 'next/router'
import Error from './404'

import Layout from '../components/layout'
import { getPage, getAllPagesWithSlug } from '../lib/api'

import { Module } from '../modules'

const Page = ({ data }) => {
  const router = useRouter()

  if (!router.isFallback && !data) {
    return <Error statusCode={404} />
  }

  const { site, menus, page } = data

  return (
    <>
      {!router.isFallback && (
        <Layout
          site={{
            seo: site.seo,
            social: site.social,
            menus: menus,
          }}
          page={{
            title: page.title,
            seo: page.seo,
          }}
        >
          {page.content?.map((module, key) => (
            <Module key={key} module={module} />
          ))}
        </Layout>
      )}
    </>
  )
}

export async function getStaticProps({ params }) {
  const pageData = await getPage(params.slug.join('/'))

  return {
    props: {
      data: pageData,
    },
  }
}

export async function getStaticPaths() {
  const allPages = await getAllPagesWithSlug()

  return {
    paths:
      allPages?.map((page) => {
        let slugs = page.slug.split('/').filter((e) => e)
        return {
          params: {
            slug: slugs,
          },
        }
      }) || [],
    fallback: false,
  }
}

export default Page
