import React from 'react'
import { useRouter } from 'next/router'

import { getPage, getAllDocSlugs } from '@data'

import NotFoundPage from '@pages/404'

import Layout from '@components/layout'
import { Module } from '@components/modules'

const Page = ({ data }) => {
  const router = useRouter()

  if (!router.isFallback && !data) {
    return <NotFoundPage statusCode={404} />
  }

  const { site, page } = data

  return (
    <>
      {!router.isFallback && (
        <Layout site={site} page={page}>
          {page.modules?.map((module, key) => (
            <Module key={key} index={key} module={module} />
          ))}
        </Layout>
      )}
    </>
  )
}

export async function getStaticProps({ params, preview, previewData }) {
  const pageData = await getPage(params.slug.join('/'), {
    active: preview,
    token: previewData?.token,
  })

  return {
    props: {
      data: pageData,
    },
  }
}

export async function getStaticPaths() {
  const allPages = await getAllDocSlugs('page')

  return {
    paths:
      allPages?.map((page) => {
        const slugs = page.slug.split('/').filter(Boolean)

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
