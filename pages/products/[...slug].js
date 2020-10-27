import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { getProduct, getErrorPage } from '../../lib/api'
import ErrorPage from '../404'

import Layout from '../../components/layout'

const Product = ({ data, error }) => {
  const router = useRouter()

  // ERROR: show 404 page
  if (!router.isFallback && !data) {
    return <ErrorPage data={error} statusCode={404} />
  }

  const { site, menus, product, shopify } = data

  console.log(data)

  return (
    <Layout
      site={{
        seo: site?.seo,
        social: site?.social,
        menus: menus,
      }}
      page={{
        title: product?.title,
        seo: product?.seo,
      }}
    >
      <section className="section">
        <h1>{shopify.title}</h1>
      </section>
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const productData = await getProduct(params.slug)
  const errorData = await getErrorPage()

  return {
    props: {
      data: productData,
      error: errorData,
    },
  }
}

export default Product
