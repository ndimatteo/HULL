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

  const toggleActive = (e, position, value) => {
    console.log('toggle variant!!')
    const newVariant = product.variants.find((v) => {
      const plucked = v.options.some(
        (opt) => opt.position === position && opt.value === value
      )
      return plucked
    })

    setActiveVariant(newVariant)
    if (position === 1) {
      history.pushState(
        null,
        null,
        `/products/${product.slug}/${value.toLowerCase()}`
      )
    }
  }

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

            <div className="product--options">
              {product.options.map((option, key) => (
                <div key={key} className="option">
                  <div className="option--title">{option.name}</div>
                  <ul className="option--values">
                    {option.values.map((value, key) => {
                      const isActive = activeVariant.options.some(
                        (opt) =>
                          opt.position === option.position &&
                          opt.value === value
                      )

                      return (
                        <li key={key} className={isActive ? 'is-active' : null}>
                          <button
                            onClick={(e) =>
                              !isActive &&
                              toggleActive(e, option.position, value)
                            }
                            className="btn is-block"
                          >
                            {value}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <Marquee line="For Sale /" reverse />
        </div>
      </section>
    </Layout>
  )
}

export default ProductPage
