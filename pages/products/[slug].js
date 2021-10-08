import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import useSWR from 'swr'

import { getProduct, getAllDocSlugs } from '@data'

import { useParams, usePrevious, centsToPrice, hasObject } from '@lib/helpers'

import { useSiteContext } from '@lib/context'

import NotFoundPage from '@pages/404'
import Layout from '@components/layout'
import { Module } from '@components/modules'

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
  const { isPageTransition } = useSiteContext()

  if (!router.isFallback && !data) {
    return <NotFoundPage statusCode={404} />
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

  const defaultVariantID = defaultVariant?.id ?? page.product.variants[0].id

  // set up our variant URL params
  const [currentParams, setCurrentParams] = useParams([
    {
      name: 'variant',
      value: defaultVariantID,
    },
  ])
  const previousParams = usePrevious(currentParams)

  // determine which params set to use
  const activeParams =
    isPageTransition && previousParams ? previousParams : currentParams

  // find our activeVariantID ID
  const paramVariantID = activeParams.find(
    (filter) => filter.name === 'variant'
  ).value
  const foundVariant = page.product.variants?.find(
    (v) => v.id == paramVariantID
  )
  const activeVariantID = foundVariant ? paramVariantID : defaultVariantID

  // handle variant change
  const updateVariant = useCallback(
    (id) => {
      const isValidVariant = page.product.variants.find((v) => v.id == id)

      setCurrentParams([
        ...activeParams,
        {
          name: 'variant',
          value: isValidVariant ? `${id}` : defaultVariantID,
        },
      ])
    },
    [activeParams]
  )

  // check our product inventory is still correct
  const { data: productInventory } = useSWR(
    ['/api/shopify/product-inventory', page.product.id],
    (url, id) => fetchInventory(url, id),
    { errorRetryCount: 3 }
  )

  // rehydrate our product after inventory is fetched
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
          schema={getProductSchema(product, activeVariantID, site)}
        >
          {page.modules?.map((module, key) => (
            <Module
              key={key}
              index={key}
              module={module}
              product={product}
              activeVariant={product.variants.find(
                (v) => v.id == activeVariantID
              )}
              onVariantChange={updateVariant}
            />
          ))}
        </Layout>
      )}
    </>
  )
}

function getProductSchema(product, activeVariantID, site) {
  if (!product) return null

  const router = useRouter()
  const { query } = router

  const variant = product.variants.find((v) => v.id == activeVariantID)

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
      name: site.title,
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
