import React, { useState } from 'react'
import { useRouter } from 'next/router'

import ErrorPage from '../404'

import { getProduct, getStaticPage, blockContent } from '../../lib/api'
import { hasObject, centsToPrice } from '../../lib/helpers'

import Layout from '../../components/layout'
import Marquee from '../../components/marquee'

import ProductGallery from '../../components/product/gallery'
import ProductPrice from '../../components/product/price'
import ProductDescription from '../../components/product/description'
import ProductOption from '../../components/product/option'
import Counter from '../../components/product/counter'
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

  // set default quantity
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
        seo: hasVariant ? activeVariant.seo || product.seo : product.seo,
      }}
      schema={{
        '@context': 'http://schema.org',
        '@type': 'Product',
        name: product.title,
        price: centsToPrice(hasVariant ? activeVariant.price : product.price),
        description: product.description,
        sku: hasVariant ? activeVariant.sku : product.sku,
        offers: {
          '@type': 'Offer',
          url: `${site.rootDomain}/products/${product.slug}${
            hasVariant ? `?variant=${activeVariant.id}` : ''
          }`,
          availability: hasVariant
            ? `http://schema.org/${
                activeVariant.inStock ? 'InStock' : 'SoldOut'
              }`
            : `http://schema.org/${product.inStock ? 'InStock' : 'SoldOut'}`,
          price: centsToPrice(hasVariant ? activeVariant.price : product.price),
          priceCurrency: 'USD',
        },
        brand: {
          '@type': 'Brand',
          name: site.seo.siteTitle,
        },
      }}
    >
      <section className="section">
        <div className={`product${product.photos.main ? ' has-gallery' : ''}`}>
          <Marquee line={product.inStock ? 'For Sale /' : 'Sold Out /'} />

          <div className="product--inner">
            {product.photos.main && (
              <ProductGallery
                photosets={product.photos.main}
                activeVariant={activeVariant}
                hasArrows
                hasThumbs
                hasCounter
              />
            )}

            <div className="product--content">
              <div className="product--header">
                <h1 className="product--title">{product.title}</h1>
                <ProductPrice
                  price={activeVariant ? activeVariant.price : product.price}
                  comparePrice={
                    activeVariant
                      ? activeVariant.comparePrice
                      : product.comparePrice
                  }
                />

                {activeVariant && (
                  <p className="product--subtitle">{activeVariant.title}</p>
                )}

                {product.description && (
                  <ProductDescription content={product.description} />
                )}
              </div>

              <div className="product--options">
                {product.options?.map(
                  (option, key) =>
                    option.values.length > 1 && (
                      <ProductOption
                        key={key}
                        position={key}
                        option={option}
                        variants={product.variants}
                        activeVariant={activeVariant}
                        onChange={changeOption}
                      />
                    )
                )}
              </div>

              <ProductActions
                activeVariant={activeVariant}
                quantity={quantity}
                setQuantity={setQuantity}
                klaviyoAccountID={product.klaviyoAccountID}
              />
            </div>
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

const ProductActions = ({
  activeVariant,
  quantity,
  setQuantity,
  klaviyoAccountID,
}) => {
  return (
    <div className="product--actions">
      {activeVariant?.inStock ? (
        <>
          {activeVariant.lowStock && (
            <div className="product--stock-indicator">
              <span>Low Stock</span>
            </div>
          )}
          <Counter max={10} onUpdate={setQuantity} />
          <AddToCart
            productID={activeVariant.id}
            quantity={quantity}
            className="btn is-block"
          >
            Add To Cart
          </AddToCart>
        </>
      ) : (
        <>
          {klaviyoAccountID ? (
            <ProductWaitlist
              variant={activeVariant.id}
              klaviyo={klaviyoAccountID}
            />
          ) : (
            <div className="btn is-disabled is-block">Out of Stock</div>
          )}
        </>
      )}
    </div>
  )
}

export async function getServerSideProps({ query, preview, previewData }) {
  const hasVariant = query.variant ? true : false // check for variant param
  const productData = await getProduct(query.slug, query.variant, {
    active: preview,
    token: previewData?.token,
  })

  const errorData = await getStaticPage(`
    *[_type == "errorPage"][0]{
      content[]{
        ${blockContent}
      },
      seo
    }
  `)

  return {
    props: {
      data: { ...{ hasVariant: hasVariant }, ...productData }, // merge our data to help with SEO
      error: errorData,
    },
  }
}

export default Product
