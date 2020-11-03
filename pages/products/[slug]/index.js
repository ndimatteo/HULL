import React from 'react'
import { useRouter } from 'next/router'

import ErrorPage from '../../404'

import { getProduct, getErrorPage } from '../../../lib/api'
import ProductPage from '../../../modules/product-page'

const Product = ({ data, error }) => {
  const router = useRouter()

  // ERROR: show 404 page
  if (!router.isFallback && !data?.product.id) {
    return <ErrorPage data={error} statusCode={404} />
  }

  console.log(data)

  return <ProductPage data={data} />
}

export async function getServerSideProps({ params }) {
  const productData = await getProduct(params.slug, params.variant)
  const errorData = await getErrorPage()

  return {
    props: {
      data: productData,
      error: errorData,
    },
  }
}

export default Product
