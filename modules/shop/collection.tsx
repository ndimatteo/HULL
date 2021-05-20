import * as React from 'react'
// import { useIntersection } from 'use-intersection'
import ProductCard from '@/blocks/shop/product-card'
import API from '@/lib/shared-types'

type CollectionProps = {
  products?: (API['Product'] | null | undefined)[]
  featuredProducts?: (API['Product'] | null | undefined)[]
  paginationLimit?: number
}

const Collection = ({
  products,
  featuredProducts = [null],
  paginationLimit = 3,
}: CollectionProps) => {
  const orderedProducts = React.useMemo(
    () =>
      mapOrder<API['Product'] | undefined>(products, featuredProducts, 'id'),
    [products, featuredProducts]
  )

  const hasPagination = paginationLimit > 0
  const pmax = paginationLimit
  const [hasMore, setMore] = React.useState<boolean>(
    (products?.length || 0) > pmax
  )
  const [pagination, setPagination] = React.useState([
    ...orderedProducts?.slice(0, pmax),
  ])

  const productsList = hasPagination ? pagination : orderedProducts

  const loadMore = React.useCallback(() => {
    const curPage = pagination.length
    const nextPage = orderedProducts.slice(curPage, curPage + pmax)
    const newPage = [...pagination, ...nextPage]

    if (hasMore) {
      setPagination(newPage)
      setMore(newPage.length < orderedProducts.length ? true : false)
    }
  }, [pagination, orderedProducts, setPagination, hasMore, setMore, pmax])

  // uncomment below and assign the ref for auto-loading on scroll
  // const loadMore = useIntersection(loadMoreRef)

  // useEffect(() => {
  //   if (loadMore) {
  //     loadMore()
  //   }
  // }, [loadMore])

  if (!products || products.length === 0) return null

  return (
    <section className="collection">
      <div className="collection--grid">
        {productsList.map((product, key) => {
          const showGallery = product?.useGallery === 'true'
          const main = product?.photos.main
          const listing = product?.photos.listing
          return (
            <ProductCard
              key={key}
              index={key}
              product={product}
              hasVisuals={!!(main || listing)}
              showGallery={main && showGallery}
              showThumbs={listing && !showGallery}
              showOption={!!product?.surfaceOption}
              showPrice
            />
          )
        })}
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

// TODO: improve these hacky types
function mapOrder<T>(
  array: any[] | undefined,
  myorder: any[] = [],
  key: string
): T[] {
  if (!array) return []

  const order = myorder.reduce((r, k, i) => ((r[k] = i + 1), r), {})
  const theSort = array.sort(
    (a, b) => (order[a[key]] || Infinity) - (order[b[key]] || Infinity)
  )
  return theSort
}

export default Collection
