import React from 'react'
import Layout from '@/components/layout'
import { getStaticPage, ERROR_PAGE_QUERY } from '@/lib/api'
import { Module } from '@/modules/index'
import type { GetStaticPageRes, ErrorPageQuery } from '@/lib/api'
import type API from '@/lib/shared-types'

type ErrorPageProps = {
  data: GetStaticPageRes<ErrorPageQuery>
}

const ErrorPage = ({ data }: ErrorPageProps) => {
  const { site, page } = data

  return (
    <Layout site={site} page={{ seo: page?.seo }}>
      {page?.modules?.map((module, key) => (
        <Module key={key} module={module} />
      ))}
    </Layout>
  )
}

export const getStaticProps = async ({
  preview,
  previewData,
}: API['GetStaticPropsContext']) => {
  const pageData = await getStaticPage(ERROR_PAGE_QUERY, {
    active: !!preview,
    token: previewData?.token,
  })

  return {
    props: {
      data: pageData,
    },
  }
}

export default ErrorPage
