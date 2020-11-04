import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import ErrorPage from '../404'

import { getProduct, getErrorPage } from '../../lib/api'
import { hasObject, centsToPrice } from '../../lib/helpers'

import Layout from '../../components/layout'
import Marquee from '../../components/marquee'

const Product = ({ data, error }) => {
  const router = useRouter()

  // ERROR: show 404 page
  if (!router.isFallback && !data?.product.id) {
    return <ErrorPage data={error} statusCode={404} />
  }

  // expand our page data
  const { site, menus, product } = data

  // find default variant if one is set
  const defaultVariant = product.variants.find(
    (v) => v.id === product.activeVariant
  )

  // find first variant
  const firstVariant = product.variants.find(
    (v) => v.id === product.firstVariantID
  )

  // set active variant as current or first
  const [activeVariant, setActiveVariant] = useState(
    defaultVariant ? defaultVariant : firstVariant
  )

  // handle option changes
  const changeOption = (e, name, value) => {
    const newOptions = activeVariant.options.map((opt) =>
      opt.name === name ? { ...opt, value: value } : opt
    )

    const newVariant = product.variants.find((variant) =>
      variant.options.every((opt) => hasObject(newOptions, opt))
    )

    setActiveVariant(newVariant)
    router.replace(
      `/products/[slug]`,
      `/products/${product.slug}?variant=${newVariant.id}`,
      { shallow: true }
    )
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
                              !isActive && changeOption(e, option.name, value)
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

export async function getServerSideProps({ query }) {
  const productData = await getProduct(query.slug, query.variant)
  const errorData = await getErrorPage()

  return {
    props: {
      data: productData,
      error: errorData,
    },
  }
}

export default Product
