import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getStaticRoute, getDynamicRoute, getActive } from '../lib/routes'

import Dropdown from './dropdown'

const Navigation = ({ menu }) => {
  const router = useRouter()

  return (
    <ul>
      {menu.items.map((item, key) => {
        const isDropdown = !!item.items
        const isLink = !!item.link
        const isStatic = getStaticRoute(item.type)

        // Dropdown List
        if (isDropdown) {
          const dropdown = item.items
          const activeDropdown =
            dropdown.filter(
              (item) => item.page && getActive(isStatic, item.page.slug, router)
            ).length > 0

          return (
            <li key={key} className={activeDropdown ? 'is-active' : null}>
              <Dropdown title={item.title} items={dropdown} />
            </li>
          )

          // External Link
        } else if (isLink) {
          return (
            <li key={key}>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={item.isButton ? 'btn' : null}
              >
                {item.title}
              </a>
            </li>
          )

          // Internal Page
        } else {
          const isActive = getActive(isStatic, item.page.slug, router)
          const isDynamic = getDynamicRoute(item.page.type)

          return (
            <li key={key} className={isActive ? 'is-active' : null}>
              <Link
                href={
                  isStatic
                    ? `/${isStatic}`
                    : `/${isDynamic ? `${isDynamic}/` : ''}${item.page.slug}`
                }
                scroll={false}
              >
                <a className={item.isButton ? 'btn' : null}>{item.title}</a>
              </Link>
            </li>
          )
        }
      })}
    </ul>
  )
}

export default Navigation
