import React, { useState } from 'react'
// import { useIntersection } from 'use-intersection'

import ProductCard from '@blocks/shop/product-card'

const Collection = ({
  products,
  featuredProducts = [],
  paginationLimit = 3,
}) => {
  if (!products || products.length === 0) return null

  const orderedProducts = mapOrder(products, featuredProducts, 'id')

  const hasPagination = paginationLimit > 0
  const pmax = paginationLimit
  const [hasMore, setMore] = useState(products.length > pmax)
  const [pagination, setPagination] = useState([
    ...orderedProducts.slice(0, pmax),
  ])

  const productsList = hasPagination ? pagination : orderedProducts

  const loadMore = () => {
    const curPage = pagination.length
    const nextPage = orderedProducts.slice(curPage, curPage + pmax)
    const newPage = [...pagination, ...nextPage]

    if (hasMore) {
      setPagination(newPage)
      setMore(newPage.length < orderedProducts.length ? true : false)
    }
  }

  // uncomment below and assign the ref for auto-loading on scroll
  // const loadMore = useIntersection(loadMoreRef)

  // useEffect(() => {
  //   if (loadMore) {
  //     loadMore()
  //   }
  // }, [loadMore])

  return (
    <section className="collection">
      <div className="collection--grid">
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
      </div>

      {hasPagination && hasMore && (
        <div className="collection--pagination">
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

  var order = myorder.reduce((r, k, i) => ((r[k] = i + 1), r), {})
  const theSort = array.sort(
    (a, b) => (order[a[key]] || Infinity) - (order[b[key]] || Infinity)
  )
  return theSort
}

export default Collection
