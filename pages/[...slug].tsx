import React from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/layout'
import { getAllDocSlugs, getPage } from '@/lib/api'
import type { GetPageRes } from '@/lib/api'
import type API from '@/lib/shared-types'

import { Module } from '@/modules/index'

const Page = ({ data }: { data: GetPageRes }) => {
  const router = useRouter()

  if (!router.isFallback && !data) {
    return router.push('/404')
  }

  const { site, page } = data

  return (
    <>
      {!router.isFallback && (
        <Layout site={site} page={page}>
          {page.modules?.map((module, key) => (
            <Module key={key} module={module} />
          ))}
        </Layout>
      )}
    </>
  )
}

export const getStaticProps = async ({
  params,
  preview,
  previewData,
}: API['GetStaticPropsContext']) => {
  const pageData = await getPage(
    ([] as (string | undefined)[]).concat(params?.slug).join('/'),
    {
      active: !!preview,
      token: previewData?.token,
    }
  )

  return {
    props: {
      data: pageData,
    },
    revalidate: 60,
  }
}

export async function getStaticPaths() {
  const allPages = await getAllDocSlugs('page')

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
