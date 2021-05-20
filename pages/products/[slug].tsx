import * as React from 'react'
import { useRouter } from 'next/router'
import { getAllDocSlugs, getProduct } from '@/lib/api'
import { centsToPrice, hasObject } from '@/lib/helpers'
import { Module } from '@/modules/index'
import axios from 'axios'
import useSWR from 'swr'
import Layout from '@/components/layout'
import type { GetProductPageRes } from '@/lib/api'
import type API from '@/lib/shared-types'
import type { NextRouter } from 'next/router'

const Product = ({ data }: { data: GetProductPageRes }) => {
  const router = useRouter()

  if (!router.isFallback && !data) {
    router.push('/404')
  }

  // extract our data
  const { site, page } = data

  // set our Product state
  const [product, setProduct] = React.useState<API['Product'] | undefined>(
    page.product
  )

  // find the default variant for this product by matching against the first product option
  const defaultVariant = React.useMemo(
    () =>
      page.product?.variants?.find((v) => {
        const option = {
          name: page.product?.options?.[0]?.name,
          value: page.product?.options?.[0]?.values[0],
          position: page.product?.options?.[0]?.position,
        }
        return hasObject(v.options, option)
      }),
    [page.product]
  )

  // set our activeVariant state to our defaultVariant (if found) or first variant
  const [activeVariantId, setActiveVariantId] = useActiveVariantId({
    fallback: defaultVariant?.id || page.product?.variants[0].id,
    variants: page.product?.variants,
  })

  // Check our product inventory is still correct
  const { data: productInventory } = useSWR<API['ProductInventoryRes']>(
    ['/api/shopify/product-inventory', page.product?.id],
    (url, id) => fetchInventory(url, id),
    { errorRetryCount: 3 }
  )

  // Rehydrate our product after inventory is fetched
  React.useEffect(() => {
    if (page.product && productInventory) {
      setProduct({
        ...page.product,
        inStock: productInventory.inStock,
        lowStock: productInventory?.lowStock,
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

  const productSchema = React.useMemo(
    () => getProductSchema(router, product, activeVariantId, site),
    [router, product, activeVariantId, site]
  )

  const activeVariant = React.useMemo(
    () => product?.variants.find((v) => v.id == activeVariantId),
    [product?.variants]
  )

  return (
    <>
      {!router.isFallback && (
        <Layout site={site} page={page} schema={productSchema}>
          {page.modules?.map((module, key) => (
            <Module
              key={key}
              module={module}
              product={product}
              activeVariant={activeVariant}
              onVariantChange={setActiveVariantId}
            />
          ))}
        </Layout>
      )}
    </>
  )
}

// setup our activeVariant hook
function useActiveVariantId({
  fallback,
  variants,
}: {
  fallback?: string
  variants?: API['Variant'][]
}): [string | undefined, (variant: string) => void] {
  const router = useRouter()
  const queryVariant = router?.query?.variant?.toString()
  const queryID = queryVariant

  const hasVariant = variants?.find((v) => v.id === queryID)
  const activeVariant = hasVariant ? queryID : fallback

  const setActiveVariant = React.useCallback(
    (variant: string) =>
      router.replace(
        `/products/${router?.query?.slug}?variant=${variant}`,
        undefined,
        {
          shallow: true,
        }
      ),
    [router]
  )

  return [activeVariant, setActiveVariant]
}

// setup our inventory fetcher
const fetchInventory = (url: string, id: string) =>
  axios.get(url, { params: { id } }).then((res) => res.data)

function getProductSchema(
  router: NextRouter,
  product?: API['Product'],
  activeVariantId?: string | number,
  site?: API['SiteData']
) {
  const { query } = router

  const variant = product?.variants.find((v) => v.id == activeVariantId)

  if (!product) return

  return {
    '@context': 'http://schema.org',
    '@type': 'Product',
    name: product.title,
    price: centsToPrice(
      query.variant && variant ? variant.price : product.price
    ),
    sku: query.variant && variant ? variant.sku : product.sku,
    offers: {
      '@type': 'Offer',
      url: `${site?.rootDomain}/products/${product.slug}${
        query.variant ? `?variant=${variant?.id}` : ''
      }`,
      availability: query.variant
        ? `http://schema.org/${variant?.inStock ? 'InStock' : 'SoldOut'}`
        : `http://schema.org/${product.inStock ? 'InStock' : 'SoldOut'}`,
      price: centsToPrice(
        query.variant && variant ? variant.price : product.price
      ),
      priceCurrency: 'USD',
    },
    brand: {
      '@type': 'Brand',
      name: site?.seo.siteTitle,
    },
  }
}

export const getStaticProps = async ({
  params,
  preview,
  previewData,
}: API['GetStaticPropsContext']) => {
  const productData = await getProduct(params?.slug, {
    active: preview,
    token: previewData?.token,
  })

  return {
    props: {
      data: productData,
    },
    revalidate: 60,
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
