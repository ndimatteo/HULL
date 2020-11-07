import React, { useState } from 'react'
import { useRouter } from 'next/router'

import ErrorPage from '../404'

import { getProduct, getErrorPage, testAdmin } from '../../lib/api'
import { hasObject, centsToPrice } from '../../lib/helpers'

import Layout from '../../components/layout'
import Marquee from '../../components/marquee'

import Counter from '../../components/counter'
import AddToCart from '../../components/product/add-to-cart'

const Product = ({ data, error }) => {
  const router = useRouter()

  // ERROR: show 404 page
  if (!router.isFallback && !data?.product.id) {
    return <ErrorPage data={error} statusCode={404} />
  }

  // expand our page data
  const { site, menus, product, hasVariant } = data

  // find default variant if one is set
  const defaultVariant = product.variants.find(
    (v) => v.id === product.activeVariant
  )

  // set active variant as current or first
  const [activeVariant, setActiveVariant] = useState(defaultVariant)

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

  // set quantity
  const [quantity, setQuantity] = useState(1)

  return (
    <Layout
      site={{
        seo: site.seo,
        social: site.social,
        menus: menus,
      }}
      page={{
        title: hasVariant
          ? `${product.title} - ${activeVariant.title}`
          : product.title,
        seo: hasVariant ? activeVariant.seo : product.seo,
      }}
      schema={{
        '@context': 'http://schema.org',
        '@type': 'Product',
        name: product.title,
        image: [
          // buildSrc(show.photo, {
          //   width: 800,
          //   height: 450,
          // }),
        ],
        price: centsToPrice(activeVariant.price),
        description: activeVariant.title,
        sku: activeVariant.sku,
        offers: {
          '@type': 'Offer',
          url: `${site.rootDomain}/products/${product.slug}`,
          availability: 'http://schema.org/InStock',
          price: centsToPrice(activeVariant.price),
          priceCurrency: 'USD',
        },
        brand: {
          '@type': 'Brand',
          name: site.seo.title,
        },
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
              {product.options?.map((option, key) => (
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

            <div className="product--actions">
              <Counter onUpdate={setQuantity} />
              <AddToCart
                productID={activeVariant.id}
                quantity={quantity}
                className="btn is-block"
              >
                Add To Cart
              </AddToCart>
            </div>
          </div>
          <Marquee line="For Sale /" reverse />
        </div>
      </section>
    </Layout>
  )
}

export async function getServerSideProps({ query }) {
  const hasVariant = query.variant ? true : false
  const productData = await getProduct(query.slug, query.variant)
  const errorData = await getErrorPage()

  return {
    props: {
      data: { ...{ hasVariant: hasVariant }, ...productData },
      error: errorData,
    },
  }
}

export default Product
