import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import CollectionPagination from './collection-pagination'

const listAnim = {
  show: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'linear',
      when: 'beforeChildren',
    },
  },
  hide: {
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: 'linear',
      when: 'afterChildren',
    },
  },
}

const CollectionList = ({ products, isLoading, paginated = 12 }) => {
  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        key={isLoading ? 'loading' : 'products'}
        initial="hide"
        animate="show"
        exit="hide"
        variants={listAnim}
        className="collection"
      >
        {products && (
          <CollectionPagination products={products} paginated={paginated} />
        )}

        {isLoading && <p className="text-center">Loading Products...</p>}
      </motion.div>
    </AnimatePresence>
  )
}

export default CollectionList
