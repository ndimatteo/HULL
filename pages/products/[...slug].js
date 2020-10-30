import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'

import { ShopifyContext } from '../../contexts/ShopifyContext'
import { getProduct, getErrorPage } from '../../lib/api'
import { centsToPrice } from '../../lib/helpers'
import ErrorPage from '../404'

import Layout from '../../components/layout'
import Marquee from '../../components/marquee'
import AddToCart from '../../components/product/addToCart'
import Drawer from '../../components/drawer'

const Product = ({ data, error }) => {
  const router = useRouter()
  const [showDrawer, setShowDrawer] = useState(false)

  // ERROR: show 404 page
  if (!router.isFallback && !data?.product.id) {
    return <ErrorPage data={error} statusCode={404} />
  }

  const { site, menus, product, shopify } = data

  const {
    checkout: { products },
  } = useContext(ShopifyContext)

  let cartItems = products.map((i, idx) => {
    return (
      <div key={idx} className="cart-item--container">
        <p>{`product: ${i.variantId}`}</p>
        <p>{`quantity: ${i.quantity}`}</p>
      </div>
    )
  })

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
            <button
              style={{ marginTop: `2em` }}
              onClick={() => setShowDrawer(!showDrawer)}
              className="btn"
            >
              show cart
            </button>
            <Marquee line="For Sale /&nbsp;" />
            <Drawer open={showDrawer} toggle={setShowDrawer} title="Cart">
              <div>
                {products.length > 0 ? (
                  cartItems
                ) : (
                  <div className="cart-item--container">
                    <p>Cart is empty</p>
                  </div>
                )}
              </div>
            </Drawer>
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
