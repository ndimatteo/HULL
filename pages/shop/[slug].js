import React from 'react'

import { getCollection, getAllDocSlugs } from '@data'

import Layout from '@components/layout'
import { Module } from '@components/modules'

const CollectionPage = ({ data }) => {
  const { site, page } = data

  return (
    <Layout site={site} page={page}>
      {page.modules?.map((module, key) => (
        <Module
          key={key}
          index={key}
          module={module}
          collectionProducts={page.products}
        />
      ))}
    </Layout>
  )
}

export async function getStaticProps({ params, preview, previewData }) {
  const collectionData = await getCollection(params.slug, {
    active: preview,
    token: previewData?.token,
  })

  return {
    props: {
      data: collectionData,
    },
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
