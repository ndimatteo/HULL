import React from 'react'

import Listbox from '@components/listbox'

const CollectionSort = ({ sortOptions, activeSort, onChange }) => {
  return (
    <div className="collection-sort is-right">
      <Listbox
        id="collection-sort"
        label="Select sorting order"
        name="sort"
        options={sortOptions}
        activeOption={activeSort}
        onChange={onChange}
        before={
          <>
            <span className="collection-sort--icon"></span>
            <span className="collection-sort--title">Sort:</span>
          </>
        }
      />
    </div>
  )
}

export default CollectionSort
