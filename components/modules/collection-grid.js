import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { useIntersection } from 'use-intersection'
import { AnimatePresence, m } from 'framer-motion'
import cx from 'classnames'

import {
  useParams,
  cartesian,
  sortAsc,
  sortDesc,
  clampRange,
} from '@lib/helpers'

import { listAnim } from '@lib/animate'

import CollectionFilter from '@components/collection-filter'
import CollectionFilterChips from '@components/collection-filter-chips'
import CollectionSort from '@components/collection-sort'
import ProductCard from '@components/product-card'

const Collection = ({ data = {} }) => {
  const { title, products, filter, sort, paginationLimit } = data

  if (!products || products.length === 0) return null

  const [hasPagination, setHasPagination] = useState(
    paginationLimit > 0 && products.length > paginationLimit
  )
  const [currentCount, setCurrentCount] = useState(
    hasPagination ? paginationLimit : products.length
  )

  const filterGroups = filter.groups

  const [currentParams, setCurrentParams] = useParams([
    {
      name: 'page',
      value: null,
    },
    {
      name: 'sort',
      value: sort?.options[0]?.slug,
    },
    ...filterGroups.map((g) => ({
      name: g.slug,
      value: null,
    })),
  ])

  // calculate our sort
  const activeSort = currentParams.find(
    (filter) => filter.name === 'sort'
  ).value

  // calculate our filters
  const currentFilters = currentParams.filter((f) => f.name !== 'sort')
  const activeFilters = currentFilters.map((filter) => {
    const validOptions = filterGroups
      .find((g) => g.slug === filter.name)
      ?.options.map((o) => o.slug)

    const currentOptions = Array.isArray(filter.value)
      ? filter.value
      : filter.value?.split(',') || []

    return {
      name: filter.name,
      values: [
        ...new Set(
          currentOptions
            .filter(Boolean)
            .filter((f) => validOptions?.includes(f))
        ),
      ],
    }
  })

  // calculate total active filters
  const filtersTotal = activeFilters.reduce((acc, cur) => {
    return Number(acc + cur.values.length)
  }, 0)

  // calculate our product order and pagination
  const orderedProducts = useFilterAndSort(products, activeFilters, activeSort)
  const paginatedProducts = [...orderedProducts.slice(0, currentCount)]

  // handle filter + sort updates
  const updateParams = useCallback(
    (params) => {
      const newFilters = currentParams.map((filter) => {
        const matchedParam = params?.find((p) => p.name === filter.name)

        return matchedParam ? { ...filter, value: matchedParam?.value } : filter
      })

      setCurrentParams(newFilters)
    },
    [currentParams]
  )

  // handle load more
  const loadMore = useCallback(() => {
    const newCount = clampRange(
      currentCount + paginationLimit,
      1,
      orderedProducts.length
    )

    setCurrentCount(newCount)
    // updateParams([{ name: 'index', value: `${newCount}` }])
  }, [currentCount, orderedProducts])

  // setup "load more" functionality
  const loadMoreRef = useRef()
  const loadMoreTrigger = useIntersection(loadMoreRef, {
    threshold: 1,
  })

  // update pagination when the count or products change
  useEffect(() => {
    setHasPagination(currentCount < orderedProducts.length)
  }, [currentCount, orderedProducts])

  // trigger load more when scrolled to "load more" ref
  // useEffect(() => {
  //   if (loadMoreTrigger) {
  //     loadMore()
  //   }
  // }, [loadMoreTrigger])

  console.log({ currentParams })

  console.log(
    currentParams
      .filter((f) => f.name !== 'index')
      .map((f) => f.value)
      .filter(Boolean)
      .join('-')
  )

  return (
    <section className="collection">
      <div className="collection--tools">
        {filter?.isActive && (
          <CollectionFilter
            filterGroups={filterGroups}
            activeFilters={activeFilters}
            filtersTotal={filtersTotal}
            itemTotal={orderedProducts.length}
            onChange={updateParams}
          />
        )}

        {sort?.isActive && (
          <CollectionSort
            sortOptions={sort.options}
            activeSort={activeSort}
            onChange={updateParams}
          />
        )}
      </div>

      {filter?.isActive && (
        <CollectionFilterChips
          id="collection-filter-chips"
          filterGroups={filterGroups}
          activeFilters={activeFilters}
          filtersTotal={filtersTotal}
          onClick={updateParams}
        />
      )}

      <div className="collection--content">
        <div
          className={cx('collection--grid', {
            'is-empty': !orderedProducts.length,
          })}
        >
          {paginatedProducts.map((product) => (
            <ProductCard
              key={
                product.id +
                currentParams
                  .map((f) => f.value)
                  .filter(Boolean)
                  .join('-')
              }
              product={product}
              activeFilters={activeFilters}
              hasVisuals={product.photos.main || product.photos.listing}
              showGallery={product.photos.main && product.useGallery === 'true'}
              showThumbs={
                product.photos.listing && product.useGallery === 'false'
              }
              showOption={product.surfaceOption}
              showPrice
              showQuickAdd
            />
          ))}

          {orderedProducts.length === 0 && (
            <div className="collection--empty">
              <p>No products found.</p>
            </div>
          )}
        </div>

        {hasPagination && (
          <div ref={loadMoreRef} className="collection--pagination">
            <button className="btn is-large" onClick={loadMore}>
              Load More
              <span className="sr-only">
                {' '}
                products from the "{title}" collection
              </span>
            </button>
          </div>
        )}

        <div className="collection--count">
          <p aria-live="polite" role="status" aria-atomic="true">
            Showing {paginatedProducts.length} of {orderedProducts.length}{' '}
            products
          </p>
        </div>
      </div>
    </section>
  )
}

const useFilterAndSort = (products, filters, sort) => {
  const filterCombos = useMemo(
    () =>
      cartesian(...filters.filter((f) => f.values.length).map((f) => f.values)),
    [filters]
  )

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        return filterCombos.some((combo) => {
          const productFilters = product.filters?.map((f) => f.slug)
          const hasCombo = combo.every((x) => productFilters?.includes(x))

          return hasCombo
        })
      }),
    [filters]
  )

  switch (sort) {
    case 'priceAsc':
      return sortAsc(filteredProducts, 'price')
    case 'priceDesc':
      return sortDesc(filteredProducts, 'price')
    case 'alphaAsc':
      return sortAsc(filteredProducts, 'title')
    case 'alphaDesc':
      return sortDesc(filteredProducts, 'title')
    case 'dateAsc':
      return sortAsc(filteredProducts, 'publishDate')
    case 'dateDesc':
      return sortDesc(filteredProducts, 'publishDate')
    case 'featured':
    default:
      return filteredProducts
  }
}

export default Collection
