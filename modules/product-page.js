import React, { useState } from 'react'

import { centsToPrice } from '../lib/helpers'

import Layout from '../components/layout'
import Marquee from '../components/marquee'

const ProductPage = ({ data }) => {
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
        <div className="product">
          <Marquee line="For Sale /" />
          <div className="product--details">
            <h1 className="product--title">{product.title}</h1>
            <h2>${centsToPrice(activeVariant.price)}</h2>
            <p>{activeVariant.title}</p>

            <ul className="product--options">
              {product.variants.map((variant) => (
                <li
                  className={
                    variant.id === activeVariant.id ? 'is-active' : false
                  }
                >
                  <button className="btn is-block">{variant.title}</button>
                </li>
              ))}
            </ul>
          </div>
          <Marquee line="For Sale /" reverse />
        </div>
      </section>
    </Layout>
  )
}

export default ProductPage
