import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { getProduct, getErrorPage } from '../../lib/api'
import { centsToPrice } from '../../lib/helpers'
import ErrorPage from '../404'

import Layout from '../../components/layout'
import Marquee from '../../components/marquee'

const Product = ({ data, error }) => {
  const router = useRouter()

  // ERROR: show 404 page
  if (!router.isFallback && !data?.product.id) {
    return <ErrorPage data={error} statusCode={404} />
  }

  const { site, menus, product, shopify } = data

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
        <h2>{product.title}</h2>
        <p>${centsToPrice(product.price)}</p>
        {product.available ? (
          <Marquee line="For Sale /&nbsp;" />
        ) : (
          <Marquee line="Out of Stock /&nbsp;" />
        )}
      </section>
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const productData = await getProduct(params.slug.join('/'))
  const errorData = await getErrorPage()

  return {
    props: {
      data: productData,
      error: errorData,
    },
  }
}

export default Product
