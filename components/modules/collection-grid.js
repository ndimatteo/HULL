import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useIntersection } from 'use-intersection'
import { AnimatePresence, m } from 'framer-motion'

import { useFilters, sortAsc, sortDesc } from '@lib/helpers'

import { listAnim } from '@lib/animate'

import Filter from '@components/filter'
import ProductCard from '@components/product-card'

const Collection = ({ products, paginationLimit = 3, sort }) => {
  if (!products || products.length === 0) return null

  const [hasPagination, setHasPagination] = useState(
    paginationLimit > 0 && products.length > paginationLimit
  )
  const [currentCount, setCurrentCount] = useState(
    hasPagination ? paginationLimit : products.length
  )

  const [currentFilters, setCurrentFilters] = useFilters([
    {
      name: 'sort',
      value: sort?.options[0]?.slug,
    },
  ])

  // calculate our product order and pagination
  const orderedProducts = filterAndSort(products, currentFilters)
  const paginatedProducts = [...orderedProducts.slice(0, currentCount)]

  // handle filter updates
  const updateFilter = useCallback(
    (name, value) => {
      const newFilters = currentFilters.map((filter) =>
        filter.name === name ? { ...filter, value: value } : filter
      )
      setCurrentFilters(newFilters)
    },
    [currentFilters]
  )

  // handle load more
  const loadMore = useCallback(() => {
    const newCount = currentCount + paginationLimit

    setCurrentCount(newCount)
    setHasPagination(newCount < orderedProducts.length)
  }, [currentCount, orderedProducts])

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
      <div className="collection--tools">
        {sort?.isActive && (
          <div className="collection--sort is-right">
            <Filter
              name="sort"
              displayTitle={
                <span className="collection--sort-title">Sort:</span>
              }
              activeOption={
                currentFilters.find((filter) => filter.name === 'sort').value
              }
              options={sort.options}
              onChange={updateFilter}
            />
          </div>
        )}
      </div>
      <div className="collection--content">
        <AnimatePresence exitBeforeEnter>
          <m.div
            key={currentFilters.map((f) => f.value).join('-')}
            initial="hide"
            animate="show"
            exit="hide"
            variants={listAnim}
            className="collection--grid"
          >
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                hasVisuals={product.photos.main || product.photos.listing}
                showGallery={
                  product.photos.main && product.useGallery === 'true'
                }
                showThumbs={
                  product.photos.listing && product.useGallery === 'false'
                }
                showOption={product.surfaceOption}
                showPrice
                showQuickAdd
              />
            ))}
          </m.div>
        </AnimatePresence>

        {hasPagination && (
          <div ref={loadMoreRef} className="collection--pagination">
            <button className="btn is-large" onClick={loadMore}>
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function filterAndSort(products, filters) {
  const sort = filters.find((filter) => filter.name === 'sort').value
  let productsCopy = [...products]

  switch (sort) {
    case 'priceAsc':
      return sortAsc(productsCopy, 'price')
    case 'priceDesc':
      return sortDesc(productsCopy, 'price')
    case 'alphaAsc':
      return sortAsc(productsCopy, 'title')
    case 'alphaDesc':
      return sortDesc(productsCopy, 'title')
    case 'dateAsc':
      return sortAsc(productsCopy, 'publishDate')
    case 'dateDesc':
      return sortDesc(productsCopy, 'publishDate')
    case 'featured':
    default:
      return products
  }
}

export default Collection
