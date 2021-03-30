import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import useSWR from 'swr'

import Error from '@pages/404'
import Layout from '@components/layout'
import { getAllDocSlugs, getProduct } from '@lib/api'
import { centsToPrice, hasObject } from '@lib/helpers'

import { Module } from '@modules/index'

// setup our activeVariant hook
function useActiveVariant({ fallback, variants }) {
  const router = useRouter()
  const queryID = parseInt(router?.query?.variant)
  const hasVariant = variants.find((v) => v.id === queryID)
  const activeVariant = hasVariant ? queryID : fallback

  const setActiveVariant = useCallback(
    (variant) => {
      router.replace(
        `/products/${router?.query?.slug}?variant=${variant}`,
        undefined,
        {
          shallow: true,
        }
      )
    },
    [router]
  )

  return [activeVariant, setActiveVariant]
}

// setup our inventory fetcher
const fetchInventory = (url, id) =>
  axios
    .get(url, {
      params: {
        id: id,
      },
    })
    .then((res) => res.data)

const Product = ({ data }) => {
  const router = useRouter()

  if (!router.isFallback && !data) {
    return <Error statusCode={404} />
  }

  // extract our data
  const { site, page } = data

  // set our Product state
  const [product, setProduct] = useState(page.product)

  // find the default variant for this product by matching against the first product option
  const defaultVariant = page.product.variants?.find((v) => {
    const option = {
      name: page.product.options?.[0]?.name,
      value: page.product.options?.[0]?.values[0],
      position: page.product.options?.[0]?.position,
    }
    return hasObject(v.options, option)
  })

  // set our activeVariant state to our defaultVariant (if found) or first variant
  const [activeVariant, setActiveVariant] = useActiveVariant({
    fallback: defaultVariant?.id || page.product.variants[0].id,
    variants: page.product.variants,
  })

  // const [activeVariant, setActiveVariant] = useState(
  //   defaultVariant?.id || page.product.variants[0].id
  // )

  // Check our product inventory is still correct
  const { data: productInventory } = useSWR(
    ['/api/shopify/product-inventory', page.product.id],
    (url, id) => fetchInventory(url, id),
    { errorRetryCount: 3 }
  )

  // Rehydrate our product after inventory is fetched
  useEffect(() => {
    if (page.product && productInventory) {
      setProduct({
        ...page.product,
        inStock: productInventory.inStock,
        lowStock: productInventory.lowStock,
        variants: [
          ...page.product.variants.map((v) => {
            const newInventory = productInventory.variants.find(
              (nv) => nv.id === v.id
            )
            return newInventory ? { ...v, ...newInventory } : v
          }),
        ],
      })
    }
  }, [page.product, productInventory])

  return (
    <>
      {!router.isFallback && (
        <Layout
          site={site}
          page={page}
          schema={getProductSchema(product, activeVariant, site)}
        >
          {page.modules?.map((module, key) => (
            <Module
              key={key}
              module={module}
              product={product}
              activeVariant={product.variants.find(
                (v) => v.id == activeVariant
              )}
              onVariantChange={setActiveVariant}
            />
          ))}
        </Layout>
      )}
    </>
  )
}

function getProductSchema(product, activeVariant, site) {
  if (!product) return null

  const router = useRouter()
  const { query } = router

  const variant = product.variants.find((v) => v.id == activeVariant)

  return {
    '@context': 'http://schema.org',
    '@type': 'Product',
    name: product.title,
    price: centsToPrice(query.variant ? variant.price : product.price),
    sku: query.variant ? variant.sku : product.sku,
    offers: {
      '@type': 'Offer',
      url: `${site.rootDomain}/products/${product.slug}${
        query.variant ? `?variant=${variant.id}` : ''
      }`,
      availability: query.variant
        ? `http://schema.org/${variant.inStock ? 'InStock' : 'SoldOut'}`
        : `http://schema.org/${product.inStock ? 'InStock' : 'SoldOut'}`,
      price: centsToPrice(query.variant ? variant.price : product.price),
      priceCurrency: 'USD',
    },
    brand: {
      '@type': 'Brand',
      name: site.seo.siteTitle,
    },
  }
}

export async function getStaticProps({ params, preview, previewData }) {
  const productData = await getProduct(params.slug, {
    active: preview,
    token: previewData?.token,
  })

  return {
    props: {
      data: productData,
    },
  }
}

export async function getStaticPaths() {
  const allProducts = await getAllDocSlugs('product')

  return {
    paths:
      allProducts?.map((page) => {
        return {
          params: {
            slug: page.slug,
          },
        }
      }) || [],
    fallback: false,
  }
}

export default Product
