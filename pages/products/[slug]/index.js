import React, { useState } from 'react'
import { useRouter } from 'next/router'

import { getProduct, getErrorPage } from '../../../lib/api'
import { centsToPrice } from '../../../lib/helpers'
import ErrorPage from '../../404'

import Layout from '../../../components/layout'
import Marquee from '../../../components/marquee'

const Product = ({ data, error }) => {
  const router = useRouter()

  // ERROR: show 404 page
  if (!router.isFallback && !data?.product.id) {
    return <ErrorPage data={error} statusCode={404} />
  }

  const { site, menus, product } = data

  const defaultVariant = product.variants.find(
    (v) => v.id === product.activeVariant
  )

  const [activeVariant, setActiveVariant] = useState(defaultVariant)

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
        <div className="grid">
          <div className="is-col-12 is-col-md-6">[gallery]</div>
          <div className="is-col-12 is-col-md-6">
            <div className="product--details">
              <Marquee line="For Sale /" />
              <h1>{product.title}</h1>
              <h2>${centsToPrice(product.price)}</h2>
              <p>{product.activeVariant}</p>
            </div>
          </div>
        </div>
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
