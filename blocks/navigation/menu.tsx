import React from 'react'
import { useRouter } from 'next/router'
import { getStaticRoute, getActive } from '@/lib/routes'
import CustomLink from '@/components/link'
import { MegaDropdownButton } from './mega-nav'
import Dropdown from './dropdown'
import cx from 'classnames'
import type API from '@/lib/shared-types'

interface MenuProps {
  items?: API['MenuItems']
  hasFocus?: boolean
  isMegaNav?: boolean
  onClick?: API['OnClick']
  className?: string
}

const Menu = ({
  items,
  isMegaNav,
  hasFocus = true,
  onClick,
  className,
}: MenuProps) => {
  const router = useRouter()

  if (!items) return null

  return (
    <ul className={className}>
      {items.map((item, key: number) => {
        const isStatic = getStaticRoute(item.page?.type)
        const isActive = getActive(isStatic, item.page?.slug, router)

        // Dropdown List
        if (!!item.dropdownItems) {
          const { dropdownItems } = item
          const activeDropdown =
            dropdownItems.filter((dropDownItem) => {
              const isStatic = getStaticRoute(dropDownItem.page?.type)
              return getActive(isStatic, dropDownItem.page?.slug, router)
            }).length > 0

          return (
            <li key={key} className={cx({ 'is-active': activeDropdown })}>
              {isMegaNav ? (
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
            <li key={key} className={cx({ 'is-active': isActive })}>
              <CustomLink
                tabIndex={!hasFocus ? -1 : undefined}
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
