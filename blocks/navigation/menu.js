import React from 'react'
import { useRouter } from 'next/router'

import { getStaticRoute, getActive } from '@lib/routes'
import CustomLink from '@components/link'

import { MegaDropdownButton } from './mega-nav'
import Dropdown from './dropdown'

const Menu = ({ items, useMegaNav, hasFocus = true, onClick, ...rest }) => {
  const router = useRouter()

  return (
    <ul {...rest}>
      {items.map((item, key) => {
        const isDropdown = !!item.dropdownItems
        const isStatic = getStaticRoute(item.page?.type)
        const isActive = getActive(isStatic, item.page?.slug, router)

        // Dropdown List
        if (isDropdown) {
          const { dropdownItems } = item
          const activeDropdown =
            dropdownItems.filter((item) => {
              const isStatic = getStaticRoute(item.page?.type)
              return getActive(isStatic, item.page?.slug, router)
            }).length > 0

          return (
            <li key={key} className={activeDropdown ? 'is-active' : null}>
              {useMegaNav ? (
                <MegaDropdownButton title={item.title} id={item._key} />
              ) : (
                <Dropdown
                  title={item.title}
                  id={item._key}
                  items={item.dropdownItems}
                  onClick={onClick}
                />
              )}
            </li>
          )

          // single link
        } else {
          return (
            <li key={key} className={isActive ? 'is-active' : null}>
              <CustomLink
                tabIndex={!hasFocus ? -1 : null}
                link={item}
                onClick={onClick}
              />
            </li>
          )
        }
      })}
    </ul>
  )
}

export default Menu
