import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'

import { getProduct, getErrorPage } from '../../lib/api'
import { Context } from '../../contexts/MainContext'
import { centsToPrice } from '../../lib/helpers'
import ErrorPage from '../404'

import Layout from '../../components/layout'
import Marquee from '../../components/marquee'
import AddToCart from '../../components/product/addToCart'

const Product = ({ data, error }) => {
  const router = useRouter()

  // ERROR: show 404 page
  if (!router.isFallback && !data?.product.id) {
    return <ErrorPage data={error} statusCode={404} />
  }

  const { site, menus, product, shopify } = data
  const {
    store: { isCartOpen },
    setIsCartOpen,
  } = useContext(Context)

  const variantId =
    product.slug === 'satans-sweatshirt' ? 37388313624749 : 37247397822637

  product.variants = [
    {
      size: 'large',
      color: 'red',
      id: variantId,
    },
  ]

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
          <>
            <AddToCart product={product} />
            <div>
              <button
                style={{ marginBottom: `3em` }}
                className="btn"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                Open Cart
              </button>
            </div>
            <Marquee line="For Sale /&nbsp;" />
          </>
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
