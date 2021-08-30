import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { useIntersection } from 'use-intersection'
import { AnimatePresence, m } from 'framer-motion'

import { useParams, cartesian, sortAsc, sortDesc } from '@lib/helpers'

import { listAnim } from '@lib/animate'

import CollectionFilter from '@components/collection-filter'
import CollectionSort from '@components/collection-sort'
import ProductCard from '@components/product-card'

const Collection = ({ products, paginationLimit = 3, filter, sort }) => {
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
    const newCount = currentCount + paginationLimit

    setCurrentCount(newCount)
  }, [currentCount, orderedProducts])

  // setup "load more" functionality
  const loadMoreRef = useRef()
  const loadMoreTrigger = useIntersection(loadMoreRef, {
    threshold: 1,
  })

  // trigger load more when scrolled to "load more" ref
  // useEffect(() => {
  //   if (loadMoreTrigger) {
  //     loadMore()
  //   }
  // }, [loadMoreTrigger])

  useEffect(() => {
    setHasPagination(currentCount < orderedProducts.length)
  }, [currentCount, orderedProducts])

  return (
    <section className="collection">
      <div className="collection--tools">
        {filter?.isActive && (
          <CollectionFilter
            filterGroups={filterGroups}
            activeFilters={activeFilters}
            itemCount={orderedProducts.length}
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

      <div className="collection--content">
        <AnimatePresence exitBeforeEnter>
          <m.div
            key={currentParams.map((f) => f.value).join('-')}
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
          const hasCombo = combo.every((x) => product.filters?.includes(x))

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
