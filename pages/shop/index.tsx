import { getStaticPage, allProducts, modules } from '@/lib/api'
import type { GetStaticPageRes, ShopPageQuery } from '@/lib/api'
import { Module } from '@/modules/index'
import React from 'react'
import Layout from '@/components/layout'
import type API from '@/lib/shared-types'

const Shop = ({ data }: { data: GetStaticPageRes<ShopPageQuery> }) => {
  const { site, page } = data

  return (
    <Layout site={site} page={page}>
      {page?.modules?.map((module, key) => (
        <Module
          key={key}
          module={module}
          collectionProducts={page.products}
          featuredProducts={page.featuredProducts}
        />
      ))}
    </Layout>
  )
}

export const getStaticProps = async ({
  preview,
  previewData,
}: API['GetStaticPropsContext']) => {
  const shopData = await getStaticPage<ShopPageQuery>(
    `
  *[_type == "shopPage"] | order(_updatedAt desc)[0]{
    hasTransparentHeader,
    modules[]{
      ${modules}
    },
    "products": ${allProducts({
      active: preview,
      token: previewData?.token,
    })},
    "featuredProducts": featuredProducts[]->productID,
    seo
  }`,
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
