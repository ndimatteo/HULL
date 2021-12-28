import React, { useState } from 'react'
import cx from 'classnames'

import { ConditionalWrapper } from '@lib/helpers'

import Drawer from '@components/drawer'
import Accordion from '@components/accordion'
import Swatch from '@components/swatch'
import Icon from '@components/icon'

const CollectionFilter = ({
  filterGroups,
  activeFilters = [],
  filtersTotal,
  itemTotal,
  onChange = () => {},
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false)

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
          Show Filters
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

          <div className="filters--actions">
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

            <button
              className="filters-close"
              onClick={() => setFiltersOpen(false)}
            >
              Done
            </button>
          </div>
        </div>

        {/* Filter Groups */}
        <div className="filters--content">
          {filterGroups.map((group, key) => (
            <FilterGroup
              key={key}
              group={group}
              activeOptions={activeFilters.find((f) => f.name === group.slug)}
              onChange={onChange}
            />
          ))}
        </div>

        {/* Filter Footer */}
        <div className="filters--footer">
          <div className="filters--footer-actions">
            <button
              onClick={() => setFiltersOpen(false)}
              className={cx('btn is-primary is-inverted is-large is-block', {
                'is-disabled': itemTotal === 0,
              })}
            >
              {itemTotal > 0 ? `Show ${itemTotal} Results` : 'No Results'}
            </button>
          </div>
        </div>
      </Drawer>
    </>
  )
}

// Build our filter group accordion
const FilterGroup = ({ group, activeOptions, onChange }) => {
  const [isOpen, setIsOpen] = useState(true)

  const { id, title, display, options } = group

  const groupTotal = activeOptions.values.length

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

            {groupTotal > 0 && (
              <span className="filter-group--count">({groupTotal})</span>
            )}
          </span>
        </>
      }
    >
      <div
        role="group"
        aria-labelledby={`filter-group-${id}`}
        className={cx('filter-group--options', {
          'is-grid': display === 'grid',
        })}
      >
        {options?.map((option, key) => (
          <FilterOption
            key={key}
            option={option}
            activeOptions={activeOptions}
            onChange={onChange}
          />
        ))}
      </div>
    </Accordion>
  )
}

// Build out our filter option
const FilterOption = ({ option, activeOptions, onChange }) => {
  const { type, title, slug, color } = option

  const { name: filterGroup, values } = activeOptions

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
          <div className="filter-option--icon">
            <ConditionalWrapper
              condition={type === 'swatch'}
              wrapper={(children) => (
                <Swatch label={title} color={color}>
                  {children}
                </Swatch>
              )}
            >
              <Icon name="Checkmark" />
            </ConditionalWrapper>
          </div>
          <div className="filter-option--label">{title}</div>
        </label>
      </div>
    </div>
  )
}

export default CollectionFilter
