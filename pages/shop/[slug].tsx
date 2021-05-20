import React from 'react'
import Layout from '@/components/layout'
import { getAllDocSlugs, getCollection } from '@/lib/api'
import { Module } from '@/modules/index'
import type { GetCollectionRes } from '@/lib/api'
import type API from '@/lib/shared-types'

const CollectionPage = ({
  data: { site, page },
}: {
  data: GetCollectionRes
}) => {
  return (
    <Layout site={site} page={page}>
      {page.modules?.map((module, key) => (
        <Module key={key} module={module} collectionProducts={page.products} />
      ))}
    </Layout>
  )
}

export const getStaticProps = async ({
  params,
  preview,
  previewData,
}: API['GetStaticPropsContext']) => {
  const collectionData = await getCollection(params?.slug, {
    active: preview,
    token: previewData?.token,
  })

  return {
    props: {
      data: collectionData,
    },
    revalidate: 60,
  }
}

export async function getStaticPaths() {
  const allCollections = await getAllDocSlugs('collection')

  return {
    paths:
      allCollections?.map((collection) => {
        return {
          params: {
            slug: collection.slug,
          },
        }
      }) || [],
    fallback: false,
  }
}

export default CollectionPage
