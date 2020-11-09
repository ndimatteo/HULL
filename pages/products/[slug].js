import React, { useState } from 'react'
import { useRouter } from 'next/router'

import ErrorPage from '../404'

import { getProduct, getErrorPage } from '../../lib/api'
import { hasObject, centsToPrice } from '../../lib/helpers'

import Layout from '../../components/layout'
import Marquee from '../../components/marquee'

import ProductOption from '../../components/product/option'
import Counter from '../../components/counter'
import AddToCart from '../../components/product/add-to-cart'
import ProductWaitlist from '../../components/product/waitlist'

const Product = ({ data, error }) => {
  const router = useRouter()

  // ERROR: show 404 page
  if (!router.isFallback && !data?.product.id) {
    return <ErrorPage data={error} statusCode={404} />
  }

  // expand our page data
  const { site, menus, product, hasVariant } = data

  // find default variant for product
  const defaultVariant = product.variants.find(
    (v) => v.id === product.activeVariant
  )

  // set active variant as default
  const [activeVariant, setActiveVariant] = useState(
    defaultVariant ? defaultVariant : product.variants[0]
  )

  // handle option changes
  const changeOption = (e, name, value) => {
    const newOptions = activeVariant.options.map((opt) =>
      opt.name === name ? { ...opt, value: value } : opt
    )

    const newVariant = product.variants.find((variant) =>
      variant.options.every((opt) => hasObject(newOptions, opt))
    )

    if (newVariant) {
      setActiveVariant(newVariant)
      router.replace(
        `/products/[slug]`,
        `/products/${product.slug}?variant=${newVariant.id}`,
        { shallow: true }
      )
    }
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
          // buildSrc(product.photo, {
          //   width: 800,
          //   height: 450,
          // }),
        ],
        price: centsToPrice(
          activeVariant ? activeVariant.price : product.price
        ),
        description: activeVariant ? activeVariant.title : product.title,
        sku: activeVariant ? activeVariant.sku : product.sku,
        offers: {
          '@type': 'Offer',
          url: `${site.rootDomain}/products/${product.slug}`,
          availability: 'http://schema.org/InStock',
          price: centsToPrice(
            activeVariant ? activeVariant.price : product.price
          ),
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
          <Marquee line={product.inStock ? 'For Sale /' : 'Sold Out /'} />
          <div className="product--details">
            <div className="product--header">
              <h1 className="product--title">{product.title}</h1>
              <h2>
                $
                {centsToPrice(
                  activeVariant ? activeVariant.price : product.price
                )}
              </h2>
              {activeVariant && <p>{activeVariant.title}</p>}
            </div>

            <div className="product--options">
              {product.options?.map((option, key) => (
                <ProductOption
                  key={key}
                  position={key}
                  option={option}
                  variants={product.variants}
                  activeVariant={activeVariant}
                  onChange={changeOption}
                />
              ))}
            </div>

            {activeVariant?.inStock ? (
              <div className="product--actions">
                {activeVariant.lowStock && (
                  <div className="product--stock-indicator">
                    <span>
                      Low
                      <br />
                      Stock
                    </span>
                  </div>
                )}
                <Counter onUpdate={setQuantity} />
                <AddToCart
                  productID={activeVariant.id}
                  quantity={quantity}
                  className="btn is-block"
                >
                  Add To Cart
                </AddToCart>
              </div>
            ) : (
              <div className="product--actions">
                <ProductWaitlist variant={activeVariant} />
              </div>
            )}
          </div>
          <Marquee
            line={product.inStock ? 'For Sale /' : 'Sold Out /'}
            reverse
          />
        </div>
      </section>
    </Layout>
  )
}

export async function getServerSideProps({ query }) {
  const hasVariant = query.variant ? true : false // check for variant param
  const productData = await getProduct(query.slug, query.variant) // fetch our product data
  const errorData = await getErrorPage()

  return {
    props: {
      data: { ...{ hasVariant: hasVariant }, ...productData }, // merge our data to help with SEO
      error: errorData,
    },
  }
}

export default Product
