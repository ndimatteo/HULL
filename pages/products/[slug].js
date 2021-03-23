import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import useSWR from 'swr'

import Error from '@pages/404'
import Layout from '@components/layout'
import { getAllDocSlugs, getProduct } from '@lib/api'
import { centsToPrice, hasObject } from '@lib/helpers'

import { Module } from '@modules/index'

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
  const { query } = router

  // set our Product state
  const [product, setProduct] = useState(page.product)

  // find default variant for product
  const defaultVariant = product.variants?.find((v) => {
    const option = {
      name: product.options?.[0]?.name,
      value: product.options?.[0]?.values[0],
      position: product.options?.[0]?.position,
    }
    return hasObject(v.options, option)
  })

  // find selected variant for product
  const selectedVariant = product.variants.find((v) => v.id == query.variant)

  // set active variant as default
  const [activeVariant, setActiveVariant] = useState(
    selectedVariant || defaultVariant || product.variants[0]
  )

  // Check our product inventory is still correct
  const { data: productInventory } = useSWR(
    ['/api/shopify/product-inventory', page.product.id],
    (url, id) => fetchInventory(url, id),
    { errorRetryCount: 2 }
  )

  // Update the active variant when an option changes
  const changeVariant = (variant) => {
    setActiveVariant(variant)

    router.replace(
      `/products/[slug]`,
      `/products/${page.product.slug}?variant=${variant.id}`,
      { shallow: true }
    )
  }

  // Rehydrate our inventory from SWR
  useEffect(() => {
    if (productInventory) {
      setProduct({
        ...product,
        inStock: productInventory.inStock,
        lowStock: productInventory.lowStock,
        variants: [
          ...product.variants.map((v) => {
            const newInventory = productInventory.variants.find(
              (nv) => nv.id === v.id
            )
            return newInventory ? { ...v, ...newInventory } : v
          }),
        ],
      })
    }
  }, [productInventory])

  // Ensure the active variant matches the route query
  useEffect(() => {
    if (selectedVariant) {
      setActiveVariant(selectedVariant)
    }
  }, [query.variant, selectedVariant])

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
              activeVariant={activeVariant}
              onVariantChange={changeVariant}
            />
          ))}
        </Layout>
      )}
    </>
  )
}

function getProductSchema(product, variant, site) {
  if (!product) return null

  const router = useRouter()
  const { query } = router

  return {
    '@context': 'http://schema.org',
    '@type': 'Product',
    name: product.title,
    price: centsToPrice(query.variant ? variant.price : product.price),
    description: product.description,
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
