import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import cx from 'classnames'

import {
  useParams,
  usePrevious,
  cartesian,
  sortAsc,
  sortDesc,
  clampRange,
} from '@lib/helpers'

import { useSiteContext } from '@lib/context'

import CollectionFilter from '@components/collection-filter'
import CollectionFilterChips from '@components/collection-filter-chips'
import CollectionSort from '@components/collection-sort'
import ProductCard from '@components/product-card'
import BlockContent from '@components/block-content'

const Collection = ({ data = {} }) => {
  const { title, products, filter, sort, paginationLimit, noFilterResults } =
    data

  if (!products || products.length === 0) return null

  const { isPageTransition } = useSiteContext()

  const collectionItems = useRef([])

  const [hasPagination, setHasPagination] = useState(
    paginationLimit > 0 && products.length > paginationLimit
  )
  const [currentCount, setCurrentCount] = useState(
    hasPagination ? paginationLimit : products.length
  )

  const filterGroups = filter.groups ?? []

  const [currentParams, setCurrentParams] = useParams([
    {
      name: 'page',
      value: null,
    },
    {
      name: 'sort',
      value: sort?.options?.[0]?.slug,
    },
    ...filterGroups.map((g) => ({
      name: g.slug,
      value: null,
    })),
  ])
  const previousParams = usePrevious(currentParams)

  // determine which params set to use
  const activeParams =
    isPageTransition && previousParams ? previousParams : currentParams

  // calculate our sort
  const activeSort = activeParams.find((filter) => filter.name === 'sort').value

  // calculate our filters
  const currentFilters = activeParams.filter(
    (f) => !['page', 'sort'].includes(f.name)
  )
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
      const newFilters = activeParams.map((filter) => {
        const matchedParam = params?.find((p) => p.name === filter.name)

        return matchedParam ? { ...filter, value: matchedParam?.value } : filter
      })

      setCurrentParams(newFilters)
    },
    [activeParams]
  )

  // handle load more
  const loadMore = useCallback(() => {
    const newCount = clampRange(
      currentCount + paginationLimit,
      1,
      orderedProducts.length
    )

    const newPage = Math.ceil(newCount / paginationLimit)

    setCurrentCount(newCount)
    updateParams([{ name: 'page', value: newPage > 1 ? `${newPage}` : null }])
  }, [currentCount, orderedProducts, paginationLimit])

  // update pagination when the count or products change
  useEffect(() => {
    const desiredPage = activeParams.find((p) => p.name === 'page').value
    const maxPage = Math.ceil(orderedProducts.length / paginationLimit)

    const newCount =
      desiredPage > 1 && desiredPage <= maxPage
        ? clampRange(paginationLimit * desiredPage, 1, orderedProducts.length)
        : null

    const pageProductIndex =
      newCount < orderedProducts?.length
        ? newCount - paginationLimit
        : orderedProducts.length - 1

    if (newCount) {
      setCurrentCount(newCount)
      collectionItems.current[pageProductIndex]?.querySelector('[href]').focus({
        preventScroll: true,
      })
    }

    setHasPagination(currentCount < orderedProducts.length)
  }, [
    currentCount,
    orderedProducts,
    activeParams,
    paginationLimit,
    collectionItems,
  ])

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
          {paginatedProducts.map((product, key) => (
            <ProductCard
              ref={(node) => (collectionItems.current[key] = node)}
              key={
                product.id +
                activeParams
                  .filter((f) => f.name !== 'page')
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
              {noFilterResults && <BlockContent blocks={noFilterResults} />}
              <button
                className="filters-reset btn is-large"
                onClick={() =>
                  updateParams(
                    activeFilters.map((filter) => ({
                      name: filter.name,
                      value: null,
                    }))
                  )
                }
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {hasPagination && (
          <div className="collection--pagination">
            <button className="btn is-large" onClick={loadMore}>
              Load More
              <span className="sr-only">
                {' '}
                products from the "{title}" collection
              </span>
            </button>
          </div>
        )}

        {orderedProducts?.length > 0 && (
          <div className="collection--count">
            <p aria-live="polite" role="status" aria-atomic="true">
              Showing {paginatedProducts.length} of {orderedProducts.length}{' '}
              products
            </p>
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
