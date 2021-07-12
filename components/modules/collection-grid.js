import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useIntersection } from 'use-intersection'
import { m } from 'framer-motion'

import { listAnim } from '@lib/animate'

import ProductCard from '@components/product-card'

const Collection = ({ products, paginationLimit = 3 }) => {
  if (!products || products.length === 0) return null
  const orderedProducts = products

  const hasPagination = paginationLimit > 0
  const [hasMore, setMore] = useState(products.length > paginationLimit)
  const [paginatedProducts, setPaginatedProducts] = useState([
    ...orderedProducts.slice(0, paginationLimit),
  ])

  const productsList = hasPagination ? paginatedProducts : orderedProducts

  // setup "load more" functionality
  const loadMore = useCallback(() => {
    const curPage = paginatedProducts.length
    const nextPage = orderedProducts.slice(curPage, curPage + paginationLimit)
    const newPage = [...paginatedProducts, ...nextPage]

    if (hasMore) {
      setPaginatedProducts(newPage)
      setMore(newPage.length < orderedProducts.length ? true : false)
    }
  }, [orderedProducts, paginatedProducts])

  // setup "load more" functionality
  const loadMoreRef = useRef(null)
  const loadMoreTrigger = useIntersection(loadMoreRef, {
    threshold: 1,
  })

  // trigger load more when scrolled to "load more" ref
  // useEffect(() => {
  //   if (loadMoreTrigger) {
  //     loadMore()
  //   }
  // }, [loadMoreTrigger])

  return (
    <section className="collection">
      <m.div
        initial="hide"
        animate="show"
        exit="hide"
        variants={listAnim}
        className="collection--grid"
      >
        {productsList.map((product, key) => (
          <ProductCard
            key={key}
            index={key}
            product={product}
            hasVisuals={product.photos.main || product.photos.listing}
            showGallery={product.photos.main && product.useGallery === 'true'}
            showThumbs={
              product.photos.listing && product.useGallery === 'false'
            }
            showOption={product.surfaceOption}
            showPrice
          />
        ))}
      </m.div>

      {hasPagination && hasMore && (
        <div ref={loadMoreRef} className="collection--pagination">
          {hasMore && (
            <button className="btn is-large" onClick={loadMore}>
              Load More
            </button>
          )}
        </div>
      )}
    </section>
  )
}

function mapOrder(array, myorder, key) {
  if (!array) return

  var order = myorder?.reduce((r, k, i) => ((r[k] = i + 1), r), {})
  const theSort = array.sort(
    (a, b) => (order[a[key]] || Infinity) - (order[b[key]] || Infinity)
  )
  return theSort
}

export default Collection
