import React from 'react'
import Layout from '@/components/layout'
import { Module } from '@/modules/index'
import { getStaticPage, HOME_PAGE_QUERY } from '@/lib/api'
import type { GetStaticPageRes, HomePageQuery } from '@/lib/api'
import type API from '@/lib/shared-types'

type HomeProps = {
  data: GetStaticPageRes<HomePageQuery>
}

const Home = ({ data }: HomeProps) => {
  const { site, page } = data

  return (
    <Layout site={site} page={page}>
      {page?.modules?.map((module: any, key: number) => (
        <Module key={key} module={module} />
      ))}
    </Layout>
  )
}

export const getStaticProps = async ({
  preview,
  previewData,
}: API['GetStaticPropsContext']) => {
  const pageData = await getStaticPage(HOME_PAGE_QUERY, {
    active: preview,
    token: previewData?.token,
  })

  return {
    props: {
      data: pageData,
    },
    revalidate: 60,
  }
}

export default Home
