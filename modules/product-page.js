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

            {product.options.map((option, key) => (
              <div className="product--option">
                <h3>{option.name}</h3>
                <ul>
                  {option.values.map((value, key) => (
                    <li key={key}>
                      <button className="btn is-block">{value}</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Marquee line="For Sale /" reverse />
        </div>
      </section>
    </Layout>
  )
}

export default ProductPage
