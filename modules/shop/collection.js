import React, { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import ProductCard from './product-card'

const Collection = ({ products, paginationLimit = 0 }) => {
  if (!products || products.length === 0) return null

  const hasPagination = paginationLimit > 0
  const pmax = paginationLimit
  const [hasMore, setMore] = useState(products.length > pmax)
  const [pagination, setPagination] = useState([...products.slice(0, pmax)])

  const productsList = hasPagination ? pagination : products

  const loadMore = () => {
    const curPage = pagination.length
    const nextPage = products.slice(curPage, curPage + pmax)
    const newPage = [...pagination, ...nextPage]

    if (hasMore) {
      setPagination(newPage)
      setMore(newPage.length < products.length ? true : false)
    }
  }

  // uncomment below and assign the ref for auto-loading on scroll
  // const [ref, inView] = useInView({
  //   rootMargin: '-100px 0px',
  // })

  // useEffect(() => {
  //   if (inView) {
  //     loadMore()
  //   }
  // }, [inView])

  return (
    <section className="collection">
      <div className="collection--grid">
        {productsList.map((product, key) => (
          <ProductCard key={key} index={key} product={product} />
        ))}
      </div>

      {hasPagination && (
        <div className="collection--pagination">
          {hasMore && (
            <button className="btn is-accent" onClick={loadMore}>
              Load More
            </button>
          )}
        </div>
      )}
    </section>
  )
}

export default Collection
