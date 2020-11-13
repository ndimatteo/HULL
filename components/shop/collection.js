import React, { useRef } from 'react'
import axios from 'axios'
import useSWR from 'swr'

import { sleeper } from '../../lib/helpers'
import CollectionList from './collection-list'

// the product fetcher
const fetchProducts = (url, collection) => {
  return axios.get(url).then((res) => res.data)
}

const Collection = ({ collection, paginationLimit }) => {
  // fetch initial data
  const { data: products } = useSWR(
    [collection ? `/api/products/${collection}` : '/api/products'],
    (url) => fetchProducts(url),
    {
      revalidateOnFocus: false,
    }
  )

  // persist data from SWR
  function useStickyData(value) {
    const val = useRef()
    if (value !== undefined) val.current = value
    return val.current
  }

  // store our persisted product data
  const stickyProducts = useStickyData(products)

  return (
    <CollectionList
      products={stickyProducts}
      isLoading={!stickyProducts}
      paginated={paginationLimit}
    />
  )
}

export default Collection
