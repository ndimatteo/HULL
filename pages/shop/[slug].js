import React from 'react'
import { useRouter } from 'next/router'

import ErrorPage from '../404'

import { getAllDocSlugs, getCollection } from '../../lib/api'

import Layout from '../../components/layout'
import Collection from '../../components/shop/collection'

const CollectionPage = ({ data, error }) => {
  const router = useRouter()

  // ERROR: show 404 page
  if (!router.isFallback && !data) {
    return <ErrorPage data={error} statusCode={404} />
  }

  // expand our page data
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
      <section className="section">
        <h1>{page.title}</h1>
        {page.collection && (
          <Collection collection={page.collection} paginationLimit={12} />
        )}
      </section>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const collectionData = await getCollection(params.slug)

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
