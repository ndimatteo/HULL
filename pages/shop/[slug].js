import React from 'react'
import { useRouter } from 'next/router'

import ErrorPage from '../404'

import { getAllDocSlugs, getCollection } from '../../lib/api'

import Layout from '../../components/layout'
import Collection from '../../components/shop/collection'

const CollectionPage = ({ data, error, preview }) => {
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
        <div className="section--wrapper">
          <h1 className="text-center">{page.title}</h1>
          {page.collection && (
            <Collection
              collection={page.collection}
              paginationLimit={12}
              preview={preview}
            />
          )}
        </div>
      </section>
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
      preview: {
        active: preview ? true : false,
        token: previewData?.token || null,
      },
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
