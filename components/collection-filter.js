import React, { useState } from 'react'
import cx from 'classnames'

import Drawer from '@components/drawer'
import Accordion from '@components/accordion'
import Swatch from '@components/swatch'
import Icon from '@components/icon'

const CollectionFilter = ({
  filterGroups,
  activeFilters = [],
  itemCount,
  onChange,
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtersTotal = activeFilters.reduce((acc, cur) => {
    return Number(acc + cur.values.length)
  }, 0)

  const handleClearFilters = () => {
    const clearedFilters = activeFilters.map((filter) => ({
      name: filter.name,
      value: null,
    }))

    onChange(clearedFilters)
  }

  return (
    <>
      <div className="collection--filter-actions">
        <button onClick={() => setFiltersOpen(true)} className="filters-toggle">
          Filters
          {filtersTotal > 0 && (
            <span className="filters-toggle--count">{filtersTotal}</span>
          )}
        </button>

        {filtersTotal > 0 && (
          <button
            onClick={() => handleClearFilters()}
            className="filters-reset btn is-small"
          >
            Clear All
          </button>
        )}
      </div>

      <Drawer
        direction="left"
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        className="filters"
      >
        {/* Filters Header */}
        <div className="filters--header">
          <div className="filters--title">
            Filters
            {filtersTotal > 0 && (
              <span className="filters--count">{filtersTotal}</span>
            )}
          </div>

          {filtersTotal > 0 && (
            <button
              onClick={() => {
                handleClearFilters()
                setFiltersOpen(false)
              }}
              className="filters-reset btn is-small"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Filter Groups */}
        <div className="filters--content">
          {filterGroups.map((group, key) => (
            <FilterGroup
              key={key}
              group={group}
              activeFilters={activeFilters.find((f) => f.name === group.slug)}
              onChange={onChange}
            />
          ))}
        </div>

        {/* Filter Footer */}
        <div className="filters--footer">
          <button
            onClick={() => setFiltersOpen(false)}
            className={cx('btn is-primary is-inverted is-large is-block', {
              'is-disabled': itemCount === 0,
            })}
          >
            {itemCount > 0 ? `Show ${itemCount} Results` : 'No Results'}
          </button>
        </div>
      </Drawer>
    </>
  )
}

// Build our filter group accordion
const FilterGroup = ({ group, activeFilters, onChange }) => {
  const [isOpen, setIsOpen] = useState(true)

  const { id, title, options } = group

  const toggleGroup = (_, state) => {
    setIsOpen(state)
  }

  return (
    <Accordion
      id={id}
      isOpen={isOpen}
      onToggle={toggleGroup}
      className="filter-group"
      title={
        <>
          <span id={`filter-group-${id}`} className="filter-group--title">
            {title}
          </span>
        </>
      }
    >
      <div
        role="group"
        aria-labelledby={`filter-group-${id}`}
        className="filter-group--options"
      >
        {options?.map((option, key) => (
          <FilterOption
            key={key}
            option={option}
            activeFilters={activeFilters}
            onChange={onChange}
          />
        ))}
      </div>
    </Accordion>
  )
}

// Build out our filter option
const FilterOption = ({ option, activeFilters, onChange }) => {
  const { type, title, slug, color } = option

  const { name: filterGroup, values } = activeFilters

  const isChecked = values?.includes(slug)

  function handleFilterChange(ev) {
    const { value } = ev.target

    const hasValue = values.includes(value)

    const newValues = hasValue
      ? values.filter((v) => v !== value).join()
      : [...values, value].join()

    onChange([
      {
        name: filterGroup,
        value: newValues || null,
      },
    ])
  }

  return (
    <div
      className={cx('filter-option', {
        'is-swatch': option.type === 'swatch',
        'is-active': isChecked,
      })}
    >
      {!type.trim() && (
        <div className="control">
          <input
            id={`filter-${slug}`}
            name={filterGroup}
            type="checkbox"
            value={slug}
            checked={values?.includes(slug) || false}
            onChange={handleFilterChange}
          />
          <label
            htmlFor={`filter-${slug}`}
            className="control--label for-checkbox"
          >
            <Icon name="Checkmark" />
            {title}
          </label>
        </div>
      )}

      {type === 'swatch' && (
        <>
          <Swatch label={title} color={color} />
          <div className="filter-option--label">{title}</div>
        </>
      )}
    </div>
  )
}

export default CollectionFilter
